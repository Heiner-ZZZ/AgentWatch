import type { DashboardEventDto } from "@/features/dashboard/contracts/dashboard-api.contract";
import type { DashboardOverview, DashboardStat } from "@/features/dashboard/models/dashboard-overview.model";
import type { DashboardTimelineEvent } from "@/features/dashboard/models/dashboard-timeline.model";

function formatOccurredAt(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatLastUpdated(value: string | null) {
  if (!value) {
    return null;
  }

  return `Actualizado ${new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))}`;
}

function toMetadata(metadata: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [
      key,
      typeof value === "string" || typeof value === "number"
        ? value
        : JSON.stringify(value),
    ]),
  );
}

export function mapDashboardEvent(event: DashboardEventDto): DashboardTimelineEvent {
  return {
    id: event.id,
    agentName: event.agentName ?? "Agente sin nombre",
    displaySummary: event.displaySummary,
    eventType: event.eventType,
    category: event.category,
    source: event.source,
    sourceApp: event.sourceApp ?? "-",
    riskLevel: event.riskLevel,
    status: event.status,
    occurredAt: formatOccurredAt(event.occurredAt),
    technicalSummary: event.technicalSummary ?? "Sin resumen técnico registrado.",
    sensitiveFlags: event.sensitiveFlags,
    metadata: toMetadata(event.metadata),
  };
}

function buildStats(events: DashboardTimelineEvent[]): DashboardStat[] {
  const pendingApprovals = events.filter((event) => event.status === "pending_approval").length;
  const highRisk = events.filter(
    (event) => event.riskLevel === "high" || event.riskLevel === "critical",
  ).length;
  const approved = events.filter((event) => event.status === "approved").length;

  return [
    {
      label: "Eventos monitoreados",
      value: String(events.length),
      tone: "low",
    },
    {
      label: "Aprobaciones pendientes",
      value: String(pendingApprovals),
      tone: pendingApprovals > 0 ? "medium" : "low",
    },
    {
      label: "Riesgos altos o críticos",
      value: String(highRisk),
      tone: highRisk > 0 ? "high" : "low",
    },
    {
      label: "Eventos aprobados",
      value: String(approved),
      tone: "low",
    },
  ];
}

export function buildDashboardOverview(input: {
  organizationId: string | null;
  organizationName: string | null;
  events: DashboardEventDto[];
  message?: string | null;
  connectionState?: DashboardOverview["connectionState"];
}): DashboardOverview {
  const mappedEvents = input.events.map(mapDashboardEvent);
  const featuredEvent = mappedEvents[0] ?? null;
  const lastUpdatedLabel = formatLastUpdated(input.events[0]?.receivedAt ?? null);

  return {
    organizationId: input.organizationId,
    organizationName: input.organizationName,
    stats: buildStats(mappedEvents),
    filters: [
      `Organización: ${input.organizationName ?? "sin contexto"}`,
      `Agente: ${mappedEvents.length > 0 ? "con actividad" : "sin actividad"}`,
      "Orden: más reciente primero",
      "Fuente: API real",
    ],
    events: mappedEvents,
    featuredEvent,
    connectionState:
      input.connectionState ?? (mappedEvents.length > 0 ? "live" : "empty"),
    message: input.message ?? null,
    lastUpdatedLabel,
  };
}
