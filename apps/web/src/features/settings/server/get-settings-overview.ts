import {
  createAdminSession,
  fetchAdminAgents,
  fetchAdminOrganizations,
  fetchAdminUsers,
} from "@/features/admin/server/admin-api";
import { fetchPendingApprovals } from "@/features/approvals/server/approvals-api";
import { fetchReports } from "@/features/reports/server/reports-api";

export async function getSettingsOverview() {
  try {
    const session = await createAdminSession();
    const organizations = await fetchAdminOrganizations(session.token);
    const selectedOrganization = organizations[0] ?? null;
    const [agents, users, approvals, reports] = await Promise.all([
      fetchAdminAgents(session.token),
      fetchAdminUsers(session.token),
      fetchPendingApprovals().catch(() => []),
      selectedOrganization ? fetchReports(selectedOrganization.id).catch(() => []) : [],
    ]);

    return {
      organization: selectedOrganization,
      stats: {
        organizations: organizations.length,
        agents: agents.length,
        users: users.length,
        pendingApprovals: approvals.length,
        reports: reports.length,
      },
      controls: [
        {
          label: "Tenancy base",
          status: selectedOrganization ? "active" : "warning",
          detail: selectedOrganization
            ? `${selectedOrganization.name} · ${selectedOrganization.timezone}`
            : "Sin organización visible",
        },
        {
          label: "Catálogo de agentes",
          status: agents.length > 0 ? "active" : "warning",
          detail:
            agents.length > 0
              ? `${agents.length} agentes registrados`
              : "Aún no existen agentes activos",
        },
        {
          label: "Aprobaciones humanas",
          status: approvals.length > 0 ? "warning" : "active",
          detail:
            approvals.length > 0
              ? `${approvals.length} acciones esperan decisión`
              : "Sin aprobaciones pendientes",
        },
        {
          label: "Evidencia exportable",
          status: reports.length > 0 ? "active" : "warning",
          detail:
            reports.length > 0
              ? `${reports.length} reportes disponibles`
              : "Sin reportes generados todavía",
        },
      ] as const,
      connectionState: selectedOrganization ? ("live" as const) : ("empty" as const),
      message: selectedOrganization
        ? null
        : "No hay una organización base para administrar configuración.",
    };
  } catch (error) {
    return {
      organization: null,
      stats: {
        organizations: 0,
        agents: 0,
        users: 0,
        pendingApprovals: 0,
        reports: 0,
      },
      controls: [],
      connectionState: "error" as const,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo consultar configuración.",
    };
  }
}
