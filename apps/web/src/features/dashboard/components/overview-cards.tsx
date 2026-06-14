import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { dashboardStats } from "@/features/dashboard/data/overview";

export function OverviewCards() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((item) => (
        <Card key={item.label} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--muted)]">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">
                {item.value}
              </p>
            </div>
            <Badge tone={item.tone}>{item.tone}</Badge>
          </div>
        </Card>
      ))}
    </section>
  );
}
