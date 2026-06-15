import type { ApprovalQueueItem, ApprovalQueueOverview } from "@/features/approvals/models/approval-queue.model";
import { fetchPendingApprovals } from "@/features/approvals/server/approvals-api";

function formatRequestedAt(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function mapApproval(item: {
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
}): ApprovalQueueItem {
  return {
    ...item,
    requestedAt: formatRequestedAt(item.requestedAt),
  };
}

export async function getApprovalQueueOverview(): Promise<ApprovalQueueOverview> {
  try {
    const approvals = await fetchPendingApprovals();
    const mappedApprovals = approvals.map(mapApproval);
    const organizationCount = new Set(mappedApprovals.map((item) => item.organizationId)).size;
    const agentCount = new Set(
      mappedApprovals.map((item) => item.agentName ?? item.eventType),
    ).size;
    const blockingCount = mappedApprovals.filter((item) => item.isBlocking).length;
    const highRiskCount = mappedApprovals.filter(
      (item) => item.riskLevel === "high" || item.riskLevel === "critical",
    ).length;

    if (mappedApprovals.length === 0) {
      return {
        pendingCount: 0,
        approvals: [],
        organizationCount,
        agentCount,
        blockingCount,
        highRiskCount,
        connectionState: "empty",
        message: "No hay aprobaciones pendientes en este momento.",
      };
    }

    return {
      pendingCount: mappedApprovals.length,
      approvals: mappedApprovals,
      organizationCount,
      agentCount,
      blockingCount,
      highRiskCount,
      connectionState: "live",
      message: null,
    };
  } catch (error) {
    return {
      pendingCount: 0,
      approvals: [],
      organizationCount: 0,
      agentCount: 0,
      blockingCount: 0,
      highRiskCount: 0,
      connectionState: "error",
      message:
        error instanceof Error
          ? error.message
          : "No se pudo consultar la cola de aprobaciones.",
    };
  }
}
