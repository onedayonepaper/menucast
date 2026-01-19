"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const http_exceptions_1 = require("../common/http-exceptions");
const uuid_1 = require("uuid");
function sha256Hex(input) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(input).digest('hex');
}
let AuthService = class AuthService {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new http_exceptions_1.UnauthorizedException('Invalid credentials');
        const ok = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!ok)
            throw new http_exceptions_1.UnauthorizedException('Invalid credentials');
        const accessExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m');
        const accessToken = await this.jwt.signAsync({ sub: user.id, storeId: user.storeId, role: user.role }, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: accessExpiresIn,
        });
        const refreshTokenPlain = `${(0, uuid_1.v4)()}${(0, uuid_1.v4)()}`;
        const refreshTokenHash = sha256Hex(refreshTokenPlain);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await this.prisma.refreshToken.create({
            data: {
                id: (0, uuid_1.v4)(),
                userId: user.id,
                tokenHash: refreshTokenHash,
                expiresAt,
            },
        });
        const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ?? '30d');
        const refreshToken = await this.jwt.signAsync({ sub: user.id, tid: refreshTokenHash }, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: refreshExpiresIn,
        });
        return {
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, role: user.role, storeId: user.storeId },
        };
    }
    async refresh(refreshToken) {
        try {
            const payload = await this.jwt.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            const tokenHash = payload.tid;
            const stored = await this.prisma.refreshToken.findFirst({
                where: {
                    tokenHash,
                    revokedAt: null,
                    expiresAt: { gt: new Date() },
                },
                include: { user: true },
            });
            if (!stored)
                throw new http_exceptions_1.UnauthorizedException('Invalid refresh token');
            const accessExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m');
            const accessToken = await this.jwt.signAsync({ sub: stored.userId, storeId: stored.user.storeId, role: stored.user.role }, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: accessExpiresIn,
            });
            return { accessToken };
        }
        catch {
            throw new http_exceptions_1.UnauthorizedException('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map