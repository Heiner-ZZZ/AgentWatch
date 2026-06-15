import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ReportCatalogOverview } from "@/features/reports/models/report-catalog.model";
import { submitReportGeneration } from "@/features/reports/server/report-actions";

type ReportCatalogProps = {
  overview: ReportCatalogOverview;
};

export function ReportCatalog({ overview }: ReportCatalogProps) {
  const highlightedReports = [
    { label: "Reportes", value: String(overview.reports.length), tone: "medium" as const },
    {
      label: "Organizaciones",
      value: String(overview.organizations.length),
      tone: "low" as const,
    },
    {
      label: "Listos para auditoría",
      value: String(overview.reports.filter((report) => report.approvalCount > 0).length),
      tone: "high" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(130deg,rgba(15,23,42,0.98),rgba(21,56,72,0.9)),radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_30%)] p-6 text-white shadow-xl">
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold">Reportes ejecutivos y evidencia PDF</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {overview.selectedOrganizationName
                ? `Evidencia exportable del tenant ${overview.selectedOrganizationName}, basada en eventos, riesgos y aprobaciones reales.`
                : "Convierte actividad operativa real en evidencia exportable para owner, cliente o auditor."}
            </p>
          </div>
          <div className="flex gap-3">
            {highlightedReports.map((item) => (
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

      <Card className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_55%),linear-gradient(135deg,_rgba(248,250,252,1),_rgba(226,232,240,0.95))] p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Reportes ejecutivos
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                {overview.selectedOrganizationName
                  ? `Genera PDF para ${overview.selectedOrganizationName} usando datos reales del período seleccionado.`
                  : "Genera evidencia PDF desde eventos, riesgos y aprobaciones reales del tenant activo."}
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
