import { Card } from "@/components/ui/card";

const reports = [
  "Resumen semanal de actividad por organizacion",
  "Reporte mensual de riesgos y aprobaciones",
  "Historial exportable para auditoria operativa",
];

export function ReportCatalog() {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold text-slate-950">Reportes</h2>
      <p className="mb-4 text-sm text-[var(--muted)]">
        Plantillas base para compartir evidencia clara en espanol.
      </p>
      <div className="space-y-3">
        {reports.map((report) => (
          <div
            key={report}
            className="rounded-2xl border border-[var(--border)] bg-white p-4"
          >
            {report}
          </div>
        ))}
      </div>
    </Card>
  );
}
