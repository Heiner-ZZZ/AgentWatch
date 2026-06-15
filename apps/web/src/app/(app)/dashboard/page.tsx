import { OverviewCards } from "@/features/dashboard/components/overview-cards";
import { RecentEventsTable } from "@/features/dashboard/components/recent-events-table";
import { getDashboardOverview } from "@/features/dashboard/server/get-dashboard-overview";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const overview = await getDashboardOverview();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          {overview.organizationName
            ? `Resumen operativo de ${overview.organizationName} conectado al API real.`
            : "Resumen de actividad de agentes y automatizaciones."}
        </p>
      </div>
      <OverviewCards stats={overview.stats} />
      <RecentEventsTable overview={overview} />
    </div>
  );
}
