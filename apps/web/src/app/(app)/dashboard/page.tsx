import { OverviewCards } from "@/features/dashboard/components/overview-cards";
import { RecentEventsTable } from "@/features/dashboard/components/recent-events-table";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <OverviewCards />
      <RecentEventsTable />
    </div>
  );
}
