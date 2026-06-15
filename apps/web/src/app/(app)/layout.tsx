import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { createDashboardSession } from "@/features/dashboard/server/dashboard-api";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  let currentUser = {
    fullName: null as string | null,
    email: null as string | null,
  };

  try {
    const session = await createDashboardSession();
    currentUser = {
      fullName: session.fullName,
      email: session.email,
    };
  } catch {
    currentUser = {
      fullName: null,
      email: null,
    };
  }

  return <AppShell currentUser={currentUser}>{children}</AppShell>;
}
