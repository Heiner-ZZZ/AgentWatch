import {
  createAdminSession,
  fetchAdminOrganizations,
  fetchAdminUsers,
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

export async function getUsersOverview() {
  try {
    const session = await createAdminSession();
    const [organizations, users] = await Promise.all([
      fetchAdminOrganizations(session.token),
      fetchAdminUsers(session.token),
    ]);

    const activeCount = users.filter((user) => user.status === "active").length;
    const privilegedCount = users.filter((user) =>
      ["owner", "admin", "operator", "auditor"].includes(user.role),
    ).length;

    return {
      organizations,
      users: users.map((user) => ({
        ...user,
        createdAtLabel: formatDateTime(user.createdAt),
      })),
      stats: {
        total: users.length,
        active: activeCount,
        privileged: privilegedCount,
        organizations: organizations.length,
      },
      connectionState: organizations.length > 0 ? ("live" as const) : ("empty" as const),
      message:
        organizations.length > 0
          ? null
          : "Primero necesitas al menos una organización para administrar usuarios.",
    };
  } catch (error) {
    return {
      organizations: [],
      users: [],
      stats: {
        total: 0,
        active: 0,
        privileged: 0,
        organizations: 0,
      },
      connectionState: "error" as const,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo consultar usuarios.",
    };
  }
}
