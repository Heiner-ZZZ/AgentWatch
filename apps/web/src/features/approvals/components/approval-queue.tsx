import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const pendingApprovals = [
  "Aprobar envio masivo a 480 destinatarios",
  "Autorizar actualizacion de pricing en hoja comercial",
  "Revisar acceso a carpeta legal del cliente",
];

export function ApprovalQueue() {
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
        <Badge tone="medium">3 pendientes</Badge>
      </div>

      <div className="space-y-3">
        {pendingApprovals.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4"
          >
            <p className="font-medium text-slate-900">{item}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
