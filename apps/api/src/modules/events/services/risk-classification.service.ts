import { Injectable } from '@nestjs/common';

type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

@Injectable()
export class RiskClassificationService {
  classify(input: {
    eventType: string;
    category: string;
    metadata: Record<string, unknown>;
    sensitiveFlags: string[];
  }): { riskLevel: RiskLevel; requiresApproval: boolean; status: string } {
    const recipientCount = this.readCount(input.metadata, 'recipient_count');
    const recordCount = this.readCount(input.metadata, 'record_count');
    const destructive = this.matches(input.eventType, [
      'delete',
      'deleted',
      'remove',
      'removed',
      'purge',
      'drop',
      'truncate',
    ]);
    const exportAction =
      this.matches(input.eventType, ['export']) || this.matches(input.category, ['export']);
    const configurationChange = this.matches(input.eventType, ['deploy', 'config', 'permission']);
    const sensitive =
      input.sensitiveFlags.length > 0 ||
      this.matches(input.sensitiveFlags.join(' '), ['customer_data', 'pii', 'credential', 'payment']);

    let riskLevel: RiskLevel = 'low';

    if (destructive) {
      riskLevel = sensitive || (recordCount ?? 0) >= 50 ? 'critical' : 'high';
    } else if ((recipientCount ?? 0) >= 100) {
      riskLevel = 'critical';
    } else if ((recipientCount ?? 0) >= 25) {
      riskLevel = 'high';
    } else if (exportAction && ((recordCount ?? 0) >= 100 || sensitive)) {
      riskLevel = 'high';
    } else if (configurationChange || exportAction || sensitive) {
      riskLevel = 'medium';
    }

    return {
      riskLevel,
      requiresApproval: riskLevel === 'high' || riskLevel === 'critical',
      status: riskLevel === 'high' || riskLevel === 'critical' ? 'pending_approval' : 'recorded',
    };
  }

  private readCount(metadata: Record<string, unknown>, key: string) {
    const value = metadata[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private matches(value: string, keywords: string[]) {
    return keywords.some((keyword) => value.includes(keyword));
  }
}
