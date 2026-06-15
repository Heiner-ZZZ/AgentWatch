import { RiskClassificationService } from './risk-classification.service';

describe('RiskClassificationService', () => {
  const service = new RiskClassificationService();

  it('classifies external communication with sensitive flag as medium risk', () => {
    expect(
      service.classify({
        eventType: 'email_sent',
        category: 'communication',
        metadata: {
          recipient_count: 18,
        },
        sensitiveFlags: ['external_recipient'],
      }),
    ).toEqual({
      riskLevel: 'medium',
      requiresApproval: false,
      status: 'recorded',
    });
  });

  it('classifies sensitive exports as high risk and requiring approval', () => {
    expect(
      service.classify({
        eventType: 'file_exported',
        category: 'data_export',
        metadata: {
          record_count: 52,
        },
        sensitiveFlags: ['customer_data'],
      }),
    ).toEqual({
      riskLevel: 'high',
      requiresApproval: true,
      status: 'pending_approval',
    });
  });

  it('classifies destructive sensitive actions as critical', () => {
    expect(
      service.classify({
        eventType: 'records_deleted',
        category: 'data_change',
        metadata: {
          record_count: 84,
        },
        sensitiveFlags: ['customer_data'],
      }),
    ).toEqual({
      riskLevel: 'critical',
      requiresApproval: true,
      status: 'pending_approval',
    });
  });

  it('raises permission changes in production to high risk', () => {
    expect(
      service.classify({
        eventType: 'permissions_updated',
        category: 'configuration',
        metadata: {
          environment: 'production',
          permission_scope: 'admin',
        },
        sensitiveFlags: [],
      }),
    ).toEqual({
      riskLevel: 'high',
      requiresApproval: true,
      status: 'pending_approval',
    });
  });

  it('treats secret-related metadata as at least medium risk', () => {
    expect(
      service.classify({
        eventType: 'secret_rotated',
        category: 'security',
        metadata: {
          key_id: 'crm_integration_secret',
        },
        sensitiveFlags: [],
      }),
    ).toEqual({
      riskLevel: 'medium',
      requiresApproval: false,
      status: 'recorded',
    });
  });
});
