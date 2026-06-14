import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrganizationsController } from './controllers/organizations.controller';
import { OrganizationsService } from './services/organizations.service';
import { CreateOrganizationUseCase } from './use-cases/create-organization.use-case';

@Module({
  imports: [AuthModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, CreateOrganizationUseCase],
})
export class OrganizationsModule {}
