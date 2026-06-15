import { Module } from '@nestjs/common';
import { OrganizationsRepository } from '../../infrastructure/database/repositories/organizations.repository';
import { OrganizationUsersRepository } from '../../infrastructure/database/repositories/organization-users.repository';
import { AuthModule } from '../auth/auth.module';
import { OrganizationsController } from './controllers/organizations.controller';
import { OrganizationsService } from './services/organizations.service';
import { CreateOrganizationUseCase } from './use-cases/create-organization.use-case';

@Module({
  imports: [AuthModule],
  controllers: [OrganizationsController],
  providers: [
    OrganizationsService,
    CreateOrganizationUseCase,
    OrganizationsRepository,
    OrganizationUsersRepository,
  ],
})
export class OrganizationsModule {}
