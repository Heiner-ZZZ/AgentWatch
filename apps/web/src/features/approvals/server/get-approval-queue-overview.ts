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

    if (mappedApprovals.length === 0) {
      return {
        pendingCount: 0,
        approvals: [],
        connectionState: "empty",
        message: "No hay aprobaciones pendientes en este momento.",
      };
    }

    return {
      pendingCount: mappedApprovals.length,
      approvals: mappedApprovals,
      connectionState: "live",
      message: null,
    };
  } catch (error) {
    return {
      pendingCount: 0,
      approvals: [],
      connectionState: "error",
      message:
        error instanceof Error
          ? error.message
          : "No se pudo consultar la cola de aprobaciones.",
    };
  }
}
