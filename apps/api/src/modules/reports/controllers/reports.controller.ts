import { Body, Controller, Get, Post } from '@nestjs/common';
import { GenerateReportDto } from '../dto/generate-report.dto';
import { ReportsService } from '../services/reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Post('generate')
  generate(@Body() payload: GenerateReportDto) {
    return {
      message: 'Report generation scaffold endpoint ready.',
      payload,
    };
  }
}
