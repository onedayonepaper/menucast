import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '../common/http-exceptions';
import { v4 as uuidv4 } from 'uuid';

function sha256Hex(input: string): string {
  const crypto = require('crypto') as typeof import('crypto');
  return crypto.createHash('sha256').update(input).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const accessExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m') as any;

    const accessToken = await this.jwt.signAsync(
      { sub: user.id, storeId: user.storeId, role: user.role },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: accessExpiresIn,
      },
    );

    const refreshTokenPlain = `${uuidv4()}${uuidv4()}`;
    const refreshTokenHash = sha256Hex(refreshTokenPlain);

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await this.prisma.refreshToken.create({
      data: {
        id: uuidv4(),
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt,
      },
    });

    const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ?? '30d') as any;

    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, tid: refreshTokenHash },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: refreshExpiresIn,
      },
    );

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role, storeId: user.storeId },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const tokenHash = payload.tid as string;
      const stored = await this.prisma.refreshToken.findFirst({
        where: {
          tokenHash,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      });
      if (!stored) throw new UnauthorizedException('Invalid refresh token');

      const accessExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m') as any;

      const accessToken = await this.jwt.signAsync(
        { sub: stored.userId, storeId: stored.user.storeId, role: stored.user.role },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: accessExpiresIn,
        },
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
