import { Injectable } from '@nestjs/common';
import { AuditLogsRepository } from '../../../infrastructure/database/repositories/audit-logs.repository';

@Injectable()
export class AuditService {
  constructor(private readonly auditLogsRepository: AuditLogsRepository) {}

  async record(input: {
    organizationId?: string | null;
    actorUserId?: string | null;
    action: string;
    targetType?: string | null;
    targetId?: string | null;
    beforeState?: Record<string, unknown> | null;
    afterState?: Record<string, unknown> | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  }) {
    return this.auditLogsRepository.create(input);
  }
}
