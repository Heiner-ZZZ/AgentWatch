import { buildDashboardOverview } from "@/features/dashboard/server/dashboard.mapper";
import {
  createDashboardSession,
  fetchDashboardEvents,
  fetchDashboardOrganizations,
} from "@/features/dashboard/server/dashboard-api";

export async function getDashboardOverview() {
  try {
    const session = await createDashboardSession();
    const organizations = await fetchDashboardOrganizations(session.token);
    const organization = organizations[0];

    if (!organization) {
      return buildDashboardOverview({
        organizationId: null,
        organizationName: null,
        events: [],
        connectionState: "empty",
        message: "La cuenta conectada no tiene organizaciones visibles todavía.",
      });
    }

    const events = await fetchDashboardEvents(session.token, organization.id);

    if (events.length === 0) {
      return buildDashboardOverview({
        organizationId: organization.id,
        organizationName: organization.name,
        events: [],
        connectionState: "empty",
        message:
          "La conexión con el API es correcta, pero aún no hay eventos en el timeline de esta organización.",
      });
    }

    return buildDashboardOverview({
      organizationId: organization.id,
      organizationName: organization.name,
      events,
      connectionState: "live",
      message: null,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo consultar el API real de AgentWatch.";

    return buildDashboardOverview({
      organizationId: null,
      organizationName: null,
      events: [],
      connectionState: "error",
      message,
    });
  }
}
