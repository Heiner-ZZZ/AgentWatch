import {
  createAdminSession,
  fetchAdminAgents,
  fetchAdminOrganizations,
} from "@/features/admin/server/admin-api";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export async function getAgentsOverview() {
  try {
    const session = await createAdminSession();
    const [organizations, agents] = await Promise.all([
      fetchAdminOrganizations(session.token),
      fetchAdminAgents(session.token),
    ]);

    const organizationMap = new Map(
      organizations.map((organization) => [organization.id, organization.name]),
    );

    return {
      organizations,
      agents: agents.map((agent) => ({
        ...agent,
        organizationName: organizationMap.get(agent.organizationId) ?? "Organización",
        updatedAtLabel: formatDateTime(agent.updatedAt),
      })),
      stats: {
        total: agents.length,
        active: agents.filter((agent) => agent.status === "active").length,
        autonomous: agents.filter((agent) => agent.autonomyLevel === "autonomous").length,
        sources: new Set(agents.map((agent) => agent.source)).size,
      },
      connectionState: organizations.length > 0 ? ("live" as const) : ("empty" as const),
      message:
        organizations.length > 0
          ? null
          : "Primero necesitas una organización para registrar agentes.",
    };
  } catch (error) {
    return {
      organizations: [],
      agents: [],
      stats: {
        total: 0,
        active: 0,
        autonomous: 0,
        sources: 0,
      },
      connectionState: "error" as const,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo consultar agentes.",
    };
  }
}
