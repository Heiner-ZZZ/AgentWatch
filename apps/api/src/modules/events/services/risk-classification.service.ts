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
    const eventType = input.eventType.toLowerCase();
    const category = input.category.toLowerCase();
    const recipientCount = this.readCount(input.metadata, 'recipient_count');
    const recordCount = this.readCount(input.metadata, 'record_count');
    const environment = this.readText(input.metadata, 'environment');
    const permissionScope = this.readText(input.metadata, 'permission_scope');
    const destructive = this.matches(eventType, [
      'delete',
      'deleted',
      'remove',
      'removed',
      'purge',
      'drop',
      'truncate',
    ]);
    const exportAction =
      this.matches(eventType, ['export']) || this.matches(category, ['export']);
    const configurationChange = this.matches(eventType, ['deploy', 'config', 'setting']);
    const permissionChange = this.matches(eventType, [
      'permission',
      'permissions',
      'role',
      'roles',
      'grant',
      'revoke',
      'access',
    ]);
    const secretSignals =
      this.matches(input.sensitiveFlags.join(' '), ['credential', 'secret', 'token', 'api_key']) ||
      this.metadataHasSensitiveSignals(input.metadata);
    const productionTarget = environment === 'production';
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
    } else if (permissionChange && (productionTarget || secretSignals || permissionScope === 'admin')) {
      riskLevel = 'high';
    } else if (configurationChange && (productionTarget || secretSignals)) {
      riskLevel = 'high';
    } else if (exportAction && ((recordCount ?? 0) >= 100 || sensitive)) {
      riskLevel = 'high';
    } else if (configurationChange || permissionChange || exportAction || sensitive || secretSignals) {
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

  private readText(metadata: Record<string, unknown>, key: string) {
    const value = metadata[key];
    return typeof value === 'string' ? value.trim().toLowerCase() : null;
  }

  private metadataHasSensitiveSignals(metadata: Record<string, unknown>) {
    return Object.entries(metadata).some(([key, value]) => {
      const haystack = `${key} ${String(value)}`.toLowerCase();

      return ['credential', 'secret', 'token', 'api_key', 'password', 'key_id'].some((keyword) =>
        haystack.includes(keyword),
      );
    });
  }
}
