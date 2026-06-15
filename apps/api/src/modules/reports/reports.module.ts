import { Module } from '@nestjs/common';
import { ApprovalsRepository } from '../../infrastructure/database/repositories/approvals.repository';
import { EventsRepository } from '../../infrastructure/database/repositories/events.repository';
import { ReportsRepository } from '../../infrastructure/database/repositories/reports.repository';
import { AuthModule } from '../auth/auth.module';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { ReportPdfService } from './services/report-pdf.service';

@Module({
  imports: [AuthModule],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    ReportsRepository,
    EventsRepository,
    ApprovalsRepository,
    ReportPdfService,
  ],
})
export class ReportsModule {}
