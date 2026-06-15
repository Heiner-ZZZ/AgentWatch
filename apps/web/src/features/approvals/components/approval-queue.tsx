import { Badge } from "@/components/ui/badge";
import { submitApprovalDecision } from "@/features/approvals/server/approval-actions";
import { Card } from "@/components/ui/card";
import type { ApprovalQueueOverview } from "@/features/approvals/models/approval-queue.model";

type ApprovalQueueProps = {
  overview: ApprovalQueueOverview;
};

const riskTone = {
  low: "low",
  medium: "medium",
  high: "high",
  critical: "critical",
} as const;

export function ApprovalQueue({ overview }: ApprovalQueueProps) {
  const summaryCards = [
    { label: "Pendientes", value: String(overview.pendingCount), tone: "medium" as const },
    {
      label: "Bloqueantes",
      value: String(overview.blockingCount),
      tone: "critical" as const,
    },
    {
      label: "Riesgo alto/crítico",
      value: String(overview.highRiskCount),
      tone: "high" as const,
    },
    { label: "Agentes", value: String(overview.agentCount), tone: "low" as const },
  ];

  if (overview.connectionState === "error") {
    return (
      <div className="space-y-6">
        <ApprovalHero
          title="Aprobaciones humanas"
          description={`Controla acciones sensibles activas en ${overview.organizationCount || 0} tenant(s) visibles.`}
          badges={summaryCards}
        />
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Cola de aprobaciones
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{overview.message}</p>
        </Card>
      </div>
    );
  }

  if (overview.approvals.length === 0) {
    return (
      <div className="space-y-6">
        <ApprovalHero
          title="Aprobaciones humanas"
          description="No hay acciones esperando validación en este momento."
          badges={summaryCards}
        />
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Cola de aprobaciones
              </h2>
              <p className="text-sm text-[var(--muted)]">
                Acciones que requieren validacion humana.
              </p>
            </div>
            <Badge tone="low">0 pendientes</Badge>
          </div>
          <p className="text-sm text-[var(--muted)]">{overview.message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ApprovalHero
        title="Aprobaciones humanas"
        description={`Hay ${overview.pendingCount} decisiones abiertas distribuidas en ${overview.organizationCount} tenant(s) y ${overview.agentCount} agente(s).`}
        badges={summaryCards}
      />

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Cola de aprobaciones
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Acciones de riesgo alto o critico que requieren validacion humana.
            </p>
          </div>
          <Badge tone="medium">{overview.pendingCount} pendientes</Badge>
        </div>

        <div className="space-y-3">
          {overview.approvals.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={riskTone[item.riskLevel]}>{item.riskLevel}</Badge>
                    {item.isBlocking ? <Badge tone="critical">bloqueante</Badge> : null}
                    <span className="text-xs text-[var(--muted)]">{item.requestedAt}</span>
                  </div>
                  <p className="font-medium text-slate-900">
                    {item.businessSummary ?? item.requestedReason ?? "Evento pendiente de aprobacion"}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    Agente: {item.agentName ?? "sin nombre"} · Evento: {item.eventType}
                  </p>
                  {item.requestedReason ? (
                    <p className="text-sm text-slate-600">{item.requestedReason}</p>
                  ) : null}
                </div>

                <form action={submitApprovalDecision} className="w-full max-w-sm space-y-2">
                  <input type="hidden" name="approvalId" value={item.id} />
                  <textarea
                    name="comment"
                    rows={3}
                    placeholder="Comentario de la decisión"
                    className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-0 focus:border-slate-400"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      name="decision"
                      value="approve"
                      className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                      Aprobar
                    </button>
                    <button
                      type="submit"
                      name="decision"
                      value="reject"
                      className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                    >
                      Rechazar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ApprovalHero({
  title,
  description,
  badges,
}: {
  title: string;
  description: string;
  badges: Array<{ label: string; value: string; tone: "low" | "medium" | "high" | "critical" }>;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(130deg,rgba(15,23,42,0.98),rgba(43,30,66,0.92)),radial-gradient(circle_at_top_left,rgba(244,114,182,0.18),transparent_30%)] p-6 text-white shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-200/80">
        FEA-08 · CU-07 · HU-05
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
        </div>
        <div className="flex gap-3">
          {badges.map((item) => (
            <div
              key={item.label}
              className="min-w-28 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-2xl font-semibold text-white">{item.value}</p>
                <Badge tone={item.tone}>{item.tone}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
