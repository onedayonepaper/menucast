import { Body, Controller, Post } from '@nestjs/common';
import { ok } from '../common/api-response';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const data = await this.auth.login(dto.email, dto.password);
    return ok(data);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {
    const data = await this.auth.refresh(dto.refreshToken);
    return ok(data);
  }
}
