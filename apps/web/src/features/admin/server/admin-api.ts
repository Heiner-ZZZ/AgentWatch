import {
  createDashboardSession,
  fetchDashboardOrganizations,
} from "@/features/dashboard/server/dashboard-api";
import type {
  AdminAgentDto,
  AdminApiEnvelope,
  AdminOrganizationDto,
  AdminUserDto,
} from "@/features/admin/contracts/admin-api.contract";

const defaultApiBaseUrl = "http://localhost:4000/api/v1";

function getApiBaseUrl() {
  return (process.env.AGENTWATCH_API_BASE_URL ?? defaultApiBaseUrl).replace(/\/+$/, "");
}

async function fetchAdminApi<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`AgentWatch API responded with ${response.status} on ${path}.`);
  }

  return (await response.json()) as T;
}

export async function createAdminSession() {
  return createDashboardSession();
}

export async function fetchAdminOrganizations(token: string) {
  return fetchDashboardOrganizations(token);
}

export async function fetchAdminUsers(token: string, organizationId?: string) {
  const query = organizationId
    ? `?organizationId=${encodeURIComponent(organizationId)}`
    : "";
  const response = await fetchAdminApi<AdminApiEnvelope<AdminUserDto[]>>(
    token,
    `/users${query}`,
  );

  return response.data;
}

export async function fetchAdminAgents(token: string) {
  const response = await fetchAdminApi<AdminApiEnvelope<AdminAgentDto[]>>(token, "/agents");
  return response.data;
}

export async function createOrganization(input: {
  name: string;
  countryCode: string;
  timezone: string;
  plan: string;
  status: "active" | "inactive";
}) {
  const session = await createAdminSession();

  await fetchAdminApi<AdminApiEnvelope<AdminOrganizationDto>>(session.token, "/organizations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateOrganization(
  organizationId: string,
  input: Partial<{
    name: string;
    countryCode: string;
    timezone: string;
    plan: string;
    status: "active" | "inactive";
  }>,
) {
  const session = await createAdminSession();

  await fetchAdminApi<AdminApiEnvelope<AdminOrganizationDto>>(
    session.token,
    `/organizations/${encodeURIComponent(organizationId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function createUser(input: {
  organizationId: string;
  email: string;
  fullName: string;
  password: string;
  role: "owner" | "admin" | "operator" | "auditor" | "viewer" | "integrator";
  status: "active" | "inactive";
}) {
  const session = await createAdminSession();

  await fetchAdminApi<AdminApiEnvelope<AdminUserDto>>(session.token, "/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function createAgent(input: {
  organizationId: string;
  name: string;
  agentType: string;
  source: string;
  description: string;
  autonomyLevel: "read_only" | "supervised" | "limited_write" | "autonomous";
  status: "active" | "inactive";
}) {
  const session = await createAdminSession();

  await fetchAdminApi<AdminApiEnvelope<AdminAgentDto>>(session.token, "/agents", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateAgent(
  agentId: string,
  input: Partial<{
    name: string;
    source: string;
    description: string;
    autonomyLevel: "read_only" | "supervised" | "limited_write" | "autonomous";
    status: "active" | "inactive";
  }>,
) {
  const session = await createAdminSession();

  await fetchAdminApi<AdminApiEnvelope<AdminAgentDto>>(
    session.token,
    `/agents/${encodeURIComponent(agentId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function rotateAgentKey(agentId: string) {
  const session = await createAdminSession();
  const response = await fetchAdminApi<
    AdminApiEnvelope<{
      id: string;
      organizationId: string;
      apiKey: string;
      rotatedAt: string;
    }>
  >(session.token, `/agents/${encodeURIComponent(agentId)}/rotate-key`, {
    method: "POST",
  });

  return response.data;
}
