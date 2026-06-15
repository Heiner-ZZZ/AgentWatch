export type DashboardTimelineEvent = {
  id: string;
  agentName: string;
  displaySummary: string;
  eventType: string;
  category: string;
  source: string;
  sourceApp: string;
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
  occurredAt: string;
  technicalSummary: string;
  sensitiveFlags: string[];
  metadata: Record<string, string | number>;
};
