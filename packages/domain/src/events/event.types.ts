export type RiskLevel = "low" | "medium" | "high" | "critical";

export type AgentEvent = {
  id: string;
  agentId: string;
  eventType: string;
  riskLevel: RiskLevel;
};
