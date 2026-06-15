import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { auditLogs } from '../schema';

@Injectable()
export class AuditLogsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: {
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
    const [auditLog] = await this.databaseService.db
      .insert(auditLogs)
      .values({
        organizationId: input.organizationId ?? null,
        actorUserId: input.actorUserId ?? null,
        action: input.action,
        targetType: input.targetType ?? null,
        targetId: input.targetId ?? null,
        beforeState: input.beforeState ?? null,
        afterState: input.afterState ?? null,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      })
      .returning();

    return auditLog;
  }
}
