import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { recentEvents } from "@/features/dashboard/data/overview";

export function RecentEventsTable() {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-950">Eventos recientes</h2>
        <p className="text-sm text-[var(--muted)]">
          Timeline resumido para operadores e integradores.
        </p>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {recentEvents.map((event) => (
          <div
            key={event.id}
            className="grid gap-3 px-5 py-4 md:grid-cols-[180px_1fr_120px_100px]"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Evento
              </p>
              <p className="mt-1 font-medium text-slate-900">{event.id}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Agente
              </p>
              <p className="mt-1 font-medium text-slate-900">{event.agent}</p>
              <p className="text-sm text-[var(--muted)]">{event.action}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Riesgo
              </p>
              <div className="mt-2">
                <Badge tone={event.risk}>{event.risk}</Badge>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Origen
              </p>
              <p className="mt-1 font-medium text-slate-900">{event.source}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
