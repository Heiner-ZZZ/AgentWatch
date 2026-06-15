import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../common/auth/decorators/current-user.decorator';
import { SessionAuthGuard } from '../../../common/auth/guards/session-auth.guard';
import { apiResponse } from '../../../common/http/presenters/api-response.presenter';
import { LoginDto } from '../dto/login.dto';
import { RefreshSessionDto } from '../dto/refresh-session.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginDto, @Req() request: { ip?: string; headers: { ['user-agent']?: string } }) {
    return apiResponse(
      await this.authService.login(payload, {
        ipAddress: request.ip ?? null,
        userAgent: request.headers['user-agent'] ?? null,
      }),
      'Login successful.',
    );
  }

  @Post('logout')
  @UseGuards(SessionAuthGuard)
  async logout(
    @CurrentUser() user: { id: string; token: string },
    @Req() request: { ip?: string; headers: { ['user-agent']?: string } },
  ) {
    return apiResponse(
      await this.authService.logout(user.token, {
        actorUserId: user.id,
        ipAddress: request.ip ?? null,
        userAgent: request.headers['user-agent'] ?? null,
      }),
      'Logout successful.',
    );
  }

  @Post('refresh')
  async refresh(
    @Body() payload: RefreshSessionDto,
    @Req() request: { ip?: string; headers: { ['user-agent']?: string } },
  ) {
    return apiResponse(
      await this.authService.refresh(payload, {
        ipAddress: request.ip ?? null,
        userAgent: request.headers['user-agent'] ?? null,
      }),
      'Session refreshed.',
    );
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  async me(@CurrentUser() user: unknown) {
    return apiResponse(user);
  }
}
