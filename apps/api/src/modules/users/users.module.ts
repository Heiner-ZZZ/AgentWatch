import { Module } from '@nestjs/common';
import { OrganizationUsersRepository } from '../../infrastructure/database/repositories/organization-users.repository';
import { UsersRepository } from '../../infrastructure/database/repositories/users.repository';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, OrganizationUsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
