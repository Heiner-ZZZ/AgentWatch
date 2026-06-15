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
  if (overview.connectionState === "error") {
    return (
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Cola de aprobaciones
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{overview.message}</p>
      </Card>
    );
  }

  if (overview.approvals.length === 0) {
    return (
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
    );
  }

  return (
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
  );
}
