import { revalidatePath } from "next/cache";
import { createDashboardSession, fetchDashboardOrganizations } from "@/features/dashboard/server/dashboard-api";
import type { ReportDto, ReportsApiEnvelope } from "@/features/reports/contracts/reports-api.contract";

const defaultApiBaseUrl = "http://localhost:4000/api/v1";

function getApiBaseUrl() {
  return (process.env.AGENTWATCH_API_BASE_URL ?? defaultApiBaseUrl).replace(/\/+$/, "");
}

async function fetchReportsApi<T>(path: string, init?: RequestInit): Promise<T> {
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

export async function fetchReports(organizationId?: string) {
  const session = await createDashboardSession();
  const searchParams = new URLSearchParams();

  if (organizationId) {
    searchParams.set("organizationId", organizationId);
  }

  const query = searchParams.toString();
  const response = await fetchReportsApi<ReportsApiEnvelope<ReportDto[]>>(
    `/reports${query ? `?${query}` : ""}`,
    {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    },
  );

  return response.data;
}

export async function fetchReportOrganizations() {
  const session = await createDashboardSession();
  return fetchDashboardOrganizations(session.token);
}

export async function generateReport(input: {
  organizationId: string;
  periodStart: string;
  periodEnd: string;
}) {
  const session = await createDashboardSession();

  await fetchReportsApi<ReportsApiEnvelope<ReportDto>>("/reports/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(input),
  });

  revalidatePath("/reports");
}

export async function createReportsDownloadSession(reportId: string) {
  const session = await createDashboardSession();

  return {
    token: session.token,
    url: `${getApiBaseUrl()}/reports/${encodeURIComponent(reportId)}/download`,
  };
}
