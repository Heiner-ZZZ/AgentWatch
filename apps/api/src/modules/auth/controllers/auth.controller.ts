import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../common/auth/decorators/current-user.decorator';
import { SessionAuthGuard } from '../../../common/auth/guards/session-auth.guard';
import { apiResponse } from '../../../common/http/presenters/api-response.presenter';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() payload: LoginDto) {
    return apiResponse(this.authService.login(payload), 'Login successful.');
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  me(@CurrentUser() user: unknown) {
    return apiResponse(user);
  }
}
