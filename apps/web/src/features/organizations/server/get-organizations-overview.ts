import {
  createAdminSession,
  fetchAdminOrganizations,
} from "@/features/admin/server/admin-api";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export async function getOrganizationsOverview() {
  try {
    const session = await createAdminSession();
    const organizations = await fetchAdminOrganizations(session.token);

    const activeCount = organizations.filter(
      (organization) => organization.status === "active",
    ).length;
    const plans = new Set(organizations.map((organization) => organization.plan));
    const countries = new Set(
      organizations.map((organization) => organization.countryCode),
    );

    return {
      organizations: organizations.map((organization) => ({
        ...organization,
        createdAtLabel: formatDate(organization.createdAt),
        updatedAtLabel: formatDate(organization.updatedAt),
      })),
      stats: {
        total: organizations.length,
        active: activeCount,
        plans: plans.size,
        countries: countries.size,
      },
      connectionState: organizations.length > 0 ? ("live" as const) : ("empty" as const),
      message:
        organizations.length > 0
          ? null
          : "La cuenta autenticada todavía no tiene organizaciones visibles.",
    };
  } catch (error) {
    return {
      organizations: [],
      stats: {
        total: 0,
        active: 0,
        plans: 0,
        countries: 0,
      },
      connectionState: "error" as const,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo consultar organizaciones.",
    };
  }
}
