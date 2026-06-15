export type AdminApiEnvelope<T> = {
  message: string | null;
  data: T;
};

export type AdminOrganizationDto = {
  id: string;
  name: string;
  countryCode: string;
  timezone: string;
  plan: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type AdminUserDto = {
  id: string;
  organizationId: string;
  organizationName: string;
  email: string;
  fullName: string;
  role: "owner" | "admin" | "operator" | "auditor" | "viewer" | "integrator";
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type AdminAgentDto = {
  id: string;
  organizationId: string;
  name: string;
  agentType: string;
  source: string;
  description: string;
  autonomyLevel: "read_only" | "supervised" | "limited_write" | "autonomous";
  status: "active" | "inactive";
  apiKeyMasked: string;
  createdAt: string;
  updatedAt: string;
};
