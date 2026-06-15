import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ReportCatalogOverview } from "@/features/reports/models/report-catalog.model";
import { submitReportGeneration } from "@/features/reports/server/report-actions";

type ReportCatalogProps = {
  overview: ReportCatalogOverview;
};

export function ReportCatalog({ overview }: ReportCatalogProps) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_55%),linear-gradient(135deg,_rgba(248,250,252,1),_rgba(226,232,240,0.95))] p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Reportes ejecutivos
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Genera evidencia PDF desde eventos, riesgos y aprobaciones reales
                del tenant activo.
              </p>
            </div>
            <Badge tone="medium">{overview.reports.length} reportes</Badge>
          </div>

          <form action={submitReportGeneration} className="grid gap-3 md:grid-cols-4">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Organizacion</span>
              <select
                name="organizationId"
                defaultValue={overview.selectedOrganizationId ?? ""}
                className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              >
                {overview.organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Desde</span>
              <input
                type="date"
                name="periodStart"
                defaultValue={overview.defaultPeriodStart}
                className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Hasta</span>
              <input
                type="date"
                name="periodEnd"
                defaultValue={overview.defaultPeriodEnd}
                className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              />
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Generar PDF
              </button>
            </div>
          </form>
        </div>
      </Card>

      {overview.connectionState === "error" ? (
        <Card className="p-5">
          <h3 className="text-base font-semibold text-slate-950">Conexion con reportes</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">{overview.message}</p>
        </Card>
      ) : null}

      {overview.connectionState !== "error" && overview.reports.length === 0 ? (
        <Card className="p-5">
          <h3 className="text-base font-semibold text-slate-950">Sin reportes aun</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {overview.message ??
              "Genera el primer PDF para dejar evidencia ejecutiva del periodo."}
          </p>
        </Card>
      ) : null}

      {overview.reports.length > 0 ? (
        <div className="space-y-3">
          {overview.reports.map((report) => (
            <Card key={report.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="low">{report.organizationName}</Badge>
                    <Badge tone="medium">{report.eventCount} eventos</Badge>
                    <Badge tone="high">{report.highRiskCount} alto/critico</Badge>
                    <Badge tone="critical">{report.approvalCount} aprobaciones</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-slate-950">
                    {report.fileName}
                  </h3>
                  <p className="text-sm text-slate-600">{report.executiveSummary}</p>
                  <p className="text-xs text-[var(--muted)]">
                    Periodo: {report.periodLabel} · Generado por{" "}
                    {report.generatedByUserName} · {report.createdAtLabel}
                  </p>
                </div>

                <a
                  href={`/reports/download/${report.id}`}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Descargar PDF
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
