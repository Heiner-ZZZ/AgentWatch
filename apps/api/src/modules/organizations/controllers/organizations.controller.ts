import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../common/auth/decorators/current-user.decorator';
import { SessionAuthGuard } from '../../../common/auth/guards/session-auth.guard';
import { apiResponse } from '../../../common/http/presenters/api-response.presenter';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { OrganizationsService } from '../services/organizations.service';

@Controller('organizations')
@UseGuards(SessionAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  async findAll(@CurrentUser() user: { id: string }) {
    return apiResponse(await this.organizationsService.findAll(user.id));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return apiResponse(await this.organizationsService.findOne(id, user.id));
  }

  @Post()
  async create(
    @Body() payload: CreateOrganizationDto,
    @CurrentUser() user: { id: string },
  ) {
    return apiResponse(
      await this.organizationsService.create(payload, user.id),
      'Organization created.',
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateOrganizationDto,
    @CurrentUser() user: { id: string },
  ) {
    return apiResponse(
      await this.organizationsService.update(id, payload, user.id),
      'Organization updated.',
    );
  }
}
