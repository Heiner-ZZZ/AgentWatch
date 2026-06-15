export type ApiEnvelope<T> = {
  message: string | null;
  data: T;
};

export type DashboardSessionDto = {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  createdAt: string;
  expiresAt: string;
};

export type DashboardOrganizationDto = {
  id: string;
  name: string;
  countryCode: string;
  timezone: string;
  plan: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type DashboardEventDto = {
  id: string;
  organizationId: string;
  agentId: string;
  agentName: string | null;
  sessionId: string | null;
  eventType: string;
  category: string;
  source: string;
  sourceApp: string | null;
  occurredAt: string;
  receivedAt: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  status:
    | "received"
    | "normalized"
    | "classified"
    | "recorded"
    | "pending_approval"
    | "approved"
    | "rejected"
    | "failed"
    | "ignored";
  technicalSummary: string | null;
  businessSummary: string | null;
  metadata: Record<string, unknown>;
  sensitiveFlags: string[];
  requiresApproval: boolean;
  idempotencyKey: string;
  displaySummary: string;
};
