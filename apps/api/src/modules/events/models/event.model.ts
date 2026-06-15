export type EventModel = {
  id: string;
  organizationId: string;
  agentId: string;
  sessionId: string | null;
  eventType: string;
  category: string;
  source: string;
  sourceApp: string | null;
  occurredAt: string;
  receivedAt: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status:
    | 'received'
    | 'normalized'
    | 'classified'
    | 'recorded'
    | 'pending_approval'
    | 'approved'
    | 'rejected'
    | 'failed'
    | 'ignored';
  technicalSummary: string | null;
  businessSummary: string | null;
  metadata: Record<string, unknown>;
  sensitiveFlags: string[];
  requiresApproval: boolean;
  idempotencyKey: string;
};
