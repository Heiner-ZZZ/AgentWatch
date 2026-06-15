import {
  Clock,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  DatabaseZap,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import type { DashboardTimelineEvent } from "@/features/dashboard/models/dashboard-timeline.model"
import type { DashboardOverview } from "@/features/dashboard/models/dashboard-overview.model"

const statusConfig = {
  pending_approval: {
    label: "Pendiente",
    icon: Clock,
    class: "text-amber-600 bg-amber-50",
  },
  recorded: {
    label: "Registrado",
    icon: ArrowUpRight,
    class: "text-blue-600 bg-blue-50",
  },
  approved: {
    label: "Aprobado",
    icon: CheckCircle2,
    class: "text-emerald-600 bg-emerald-50",
  },
  rejected: {
    label: "Rechazado",
    icon: ShieldAlert,
    class: "text-rose-600 bg-rose-50",
  },
  failed: {
    label: "Fallido",
    icon: ShieldAlert,
    class: "text-rose-600 bg-rose-50",
  },
  received: {
    label: "Recibido",
    icon: ArrowUpRight,
    class: "text-sky-600 bg-sky-50",
  },
  normalized: {
    label: "Normalizado",
    icon: ArrowUpRight,
    class: "text-indigo-600 bg-indigo-50",
  },
  classified: {
    label: "Clasificado",
    icon: ArrowUpRight,
    class: "text-violet-600 bg-violet-50",
  },
  ignored: {
    label: "Ignorado",
    icon: ArrowUpRight,
    class: "text-slate-600 bg-slate-100",
  },
}

const toneConfig = {
  low: { class: "text-emerald-600 bg-emerald-50", label: "Bajo" },
  medium: { class: "text-amber-600 bg-amber-50", label: "Medio" },
  high: { class: "text-rose-600 bg-rose-50", label: "Alto" },
  critical: { class: "text-red-600 bg-red-50", label: "Crítico" },
}

type RecentEventsTableProps = {
  overview: DashboardOverview
}

function EmptyState({
  title,
  description,
}: {
  title: string
  description: string | null
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <DatabaseZap className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {description ?? "No hay datos disponibles para esta vista."}
          </p>
        </div>
      </div>
    </Card>
  )
}

function MetadataRow({ event }: { event: DashboardTimelineEvent }) {
  return (
    <dd className="mt-1 space-y-1.5">
      {Object.entries(event.metadata).map(([key, value]) => (
        <div
          key={key}
          className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-1.5"
        >
          <span className="text-xs text-slate-400">{key}</span>
          <span className="text-xs font-medium text-slate-900">{value}</span>
        </div>
      ))}
    </dd>
  )
}

export function RecentEventsTable({ overview }: RecentEventsTableProps) {
  const featuredEvent = overview.featuredEvent

  if (overview.connectionState === "error") {
    return (
      <EmptyState
        title="No se pudo cargar el timeline desde el API"
        description={overview.message}
      />
    )
  }

  if (overview.events.length === 0 || !featuredEvent) {
    return (
      <EmptyState
        title="Todavía no hay eventos para mostrar"
        description={overview.message}
      />
    )
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Timeline operativo</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cronología real de eventos de agentes
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {overview.filters.map((filter) => (
              <span
                key={filter}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600"
              >
                {filter}
              </span>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {overview.events.map((event) => {
            const status = statusConfig[event.status as keyof typeof statusConfig] || statusConfig.recorded
            const StatusIcon = status.icon
            const tone = toneConfig[event.riskLevel as keyof typeof toneConfig] || toneConfig.low
            return (
              <div
                key={event.id}
                className="grid cursor-pointer items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50 md:grid-cols-[100px_1fr_100px_100px_28px]"
              >
                <div>
                  <p className="text-xs text-slate-500">{event.occurredAt}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{event.id}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{event.displaySummary}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {event.agentName}
                  </p>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${tone.class}`}>
                    <AlertTriangle className="size-3" />
                    {tone.label}
                  </span>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${status.class}`}>
                    <StatusIcon className="size-3" />
                    {status.label}
                  </span>
                </div>
                <div className="flex justify-end">
                  <ChevronRight className="size-4 text-slate-300" />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              Detalle del evento
            </p>
            {overview.lastUpdatedLabel ? (
              <p className="mt-2 text-xs text-slate-500">{overview.lastUpdatedLabel}</p>
            ) : null}
          </div>
          {overview.organizationName ? (
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
              {overview.organizationName}
            </span>
          ) : null}
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-900">
          {featuredEvent.displaySummary}
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {(() => {
            const t = toneConfig[featuredEvent.riskLevel]
            const s = statusConfig[featuredEvent.status as keyof typeof statusConfig] || statusConfig.recorded
            const SI = s.icon
            return (
              <>
                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${t.class}`}>
                  <AlertTriangle className="size-3" />
                  {t.label}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${s.class}`}>
                  <SI className="size-3" />
                  {s.label}
                </span>
              </>
            )
          })()}
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          <div>
            <dt className="text-xs text-slate-400">Agente</dt>
            <dd className="font-medium text-slate-900">{featuredEvent.agentName}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">Resumen técnico</dt>
            <dd className="text-sm text-slate-600">{featuredEvent.technicalSummary}</dd>
          </div>
          {featuredEvent.sensitiveFlags.length > 0 && (
            <div>
              <dt className="text-xs text-slate-400">Flags sensibles</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {featuredEvent.sensitiveFlags.map((flag) => (
                  <span
                    key={flag}
                    className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600"
                  >
                    {flag}
                  </span>
                ))}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-slate-400">Metadata clave</dt>
            <MetadataRow event={featuredEvent} />
          </div>
        </dl>
      </Card>
    </section>
  )
}
