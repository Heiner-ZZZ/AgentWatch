import type { ReactNode } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Topbar } from "@/components/layout/topbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 bg-slate-50 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
