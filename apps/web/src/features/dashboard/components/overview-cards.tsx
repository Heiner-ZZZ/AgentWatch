import { TrendingUp, TrendingDown, Activity, CheckCircle, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { DashboardStat } from "@/features/dashboard/models/dashboard-overview.model"

const iconMap = {
  low: CheckCircle,
  medium: Activity,
  high: AlertTriangle,
}

const colorMap = {
  low: "text-emerald-600 bg-emerald-50",
  medium: "text-amber-600 bg-amber-50",
  high: "text-rose-600 bg-rose-50",
}

type OverviewCardsProps = {
  stats: DashboardStat[];
}

export function OverviewCards({ stats }: OverviewCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = iconMap[item.tone]
        return (
          <Card key={item.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
              </div>
              <div className={`flex size-9 items-center justify-center rounded-lg ${colorMap[item.tone]}`}>
                <Icon className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <div className={`flex items-center gap-0.5 text-xs ${item.tone === "high" ? "text-rose-500" : "text-emerald-500"}`}>
                {item.tone === "high" ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                <span className="font-medium">
                  {item.tone === "high" ? "+12%" : "-3%"}
                </span>
              </div>
              <span className="text-xs text-slate-400">vs. ayer</span>
            </div>
          </Card>
        )
      })}
    </section>
  )
}
