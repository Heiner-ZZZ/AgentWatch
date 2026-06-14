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
  findAll() {
    return apiResponse(this.organizationsService.findAll());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return apiResponse(this.organizationsService.findOne(id));
  }

  @Post()
  create(
    @Body() payload: CreateOrganizationDto,
    @CurrentUser() user: { id: string },
  ) {
    return apiResponse(
      this.organizationsService.create(payload, user.id),
      'Organization created.',
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateOrganizationDto) {
    return apiResponse(this.organizationsService.update(id, payload), 'Organization updated.');
  }
}
