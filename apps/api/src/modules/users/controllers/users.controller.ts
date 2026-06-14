import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from '../../../common/auth/guards/session-auth.guard';
import { apiResponse } from '../../../common/http/presenters/api-response.presenter';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
@UseGuards(SessionAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return apiResponse(this.usersService.findAll());
  }

  @Post()
  create(@Body() payload: CreateUserDto) {
    return apiResponse(this.usersService.create(payload), 'User created.');
  }
}
