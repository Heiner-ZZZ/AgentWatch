import type { ReactNode } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Topbar } from "@/components/layout/topbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[256px_1fr]">
      <Sidebar />
      <div className="flex min-h-screen flex-col">
        <Topbar />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
