import { revalidatePath } from "next/cache";
import { createDashboardSession } from "@/features/dashboard/server/dashboard-api";
import type {
  ApprovalDto,
  ApprovalsApiEnvelope,
} from "@/features/approvals/contracts/approvals-api.contract";

const defaultApiBaseUrl = "http://localhost:4000/api/v1";

function getApiBaseUrl() {
  return (process.env.AGENTWATCH_API_BASE_URL ?? defaultApiBaseUrl).replace(/\/+$/, "");
}

async function fetchApprovalsApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`AgentWatch API responded with ${response.status} on ${path}.`);
  }

  return (await response.json()) as T;
}

export async function fetchPendingApprovals() {
  const session = await createDashboardSession();
  const response = await fetchApprovalsApi<ApprovalsApiEnvelope<ApprovalDto[]>>(
    "/approvals?status=pending",
    {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    },
  );

  return response.data;
}

export async function decideApproval(input: {
  approvalId: string;
  decision: "approve" | "reject";
  comment?: string;
}) {
  const session = await createDashboardSession();

  await fetchApprovalsApi<ApprovalsApiEnvelope<ApprovalDto>>(
    `/approvals/${encodeURIComponent(input.approvalId)}/decision`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({
        decision: input.decision,
        comment: input.comment ?? "",
      }),
    },
  );

  revalidatePath("/approvals");
}
