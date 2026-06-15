import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../common/auth/decorators/current-user.decorator';
import { SessionAuthGuard } from '../../../common/auth/guards/session-auth.guard';
import { apiResponse } from '../../../common/http/presenters/api-response.presenter';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
@UseGuards(SessionAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @CurrentUser() user: { id: string },
    @Query('organizationId') organizationId?: string,
  ) {
    return apiResponse(await this.usersService.findAll(user.id, organizationId));
  }

  @Post()
  async create(@Body() payload: CreateUserDto, @CurrentUser() user: { id: string }) {
    return apiResponse(await this.usersService.create(payload, user.id), 'User created.');
  }
}
