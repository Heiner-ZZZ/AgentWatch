export type ApprovalQueueItem = {
  id: string;
  organizationId: string;
  eventId: string;
  status: "pending" | "approved" | "rejected";
  decision: "approve" | "reject" | null;
  requestedReason: string | null;
  decisionComment: string | null;
  requestedAt: string;
  decidedAt: string | null;
  decidedByUserName: string | null;
  isBlocking: boolean;
  riskLevel: "low" | "medium" | "high" | "critical";
  eventStatus: string;
  businessSummary: string | null;
  technicalSummary: string | null;
  agentName: string | null;
  eventType: string;
};

export type ApprovalQueueOverview = {
  pendingCount: number;
  approvals: ApprovalQueueItem[];
  connectionState: "live" | "empty" | "error";
  message: string | null;
};
