export type ApprovalsApiEnvelope<T> = {
  message: string | null;
  data: T;
};

export type ApprovalDto = {
  id: string;
  organizationId: string;
  eventId: string;
  status: "pending" | "approved" | "rejected";
  decision: "approve" | "reject" | null;
  requestedReason: string | null;
  decisionComment: string | null;
  requestedAt: string;
  decidedAt: string | null;
  decidedByUserId: string | null;
  decidedByUserName: string | null;
  isBlocking: boolean;
  resolutionMetadata: Record<string, unknown>;
  eventType: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  eventStatus: string;
  businessSummary: string | null;
  technicalSummary: string | null;
  agentId: string;
  agentName: string | null;
};
