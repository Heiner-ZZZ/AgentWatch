import type {
  ApiEnvelope,
  DashboardEventDto,
  DashboardOrganizationDto,
  DashboardSessionDto,
} from "@/features/dashboard/contracts/dashboard-api.contract";

const defaultApiBaseUrl = "http://localhost:4000/api/v1";

const dashboardCredentials = {
  email: process.env.AGENTWATCH_DASHBOARD_EMAIL ?? "owner@agentwatch.local",
  password: process.env.AGENTWATCH_DASHBOARD_PASSWORD ?? "demo1234",
};

function getApiBaseUrl() {
  return (process.env.AGENTWATCH_API_BASE_URL ?? defaultApiBaseUrl).replace(/\/+$/, "");
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
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

export async function createDashboardSession() {
  const response = await fetchApi<ApiEnvelope<DashboardSessionDto>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(dashboardCredentials),
  });

  return response.data;
}

export async function fetchDashboardOrganizations(token: string) {
  const response = await fetchApi<ApiEnvelope<DashboardOrganizationDto[]>>("/organizations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function fetchDashboardEvents(token: string, organizationId: string) {
  const response = await fetchApi<ApiEnvelope<DashboardEventDto[]>>(
    `/events?organizationId=${encodeURIComponent(organizationId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}
