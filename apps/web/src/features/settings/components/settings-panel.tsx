import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { submitOrganizationSettings } from "@/features/admin/server/admin-actions";

type SettingsPanelProps = {
  overview: Awaited<
    ReturnType<typeof import("@/features/settings/server/get-settings-overview").getSettingsOverview>
  >;
};

const controlTone = {
  active: "low",
  warning: "medium",
} as const;

export function SettingsPanel({ overview }: SettingsPanelProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(140deg,rgba(15,23,42,0.97),rgba(71,85,105,0.9)),radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_35%)] p-6 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/80">
          Gobierno operativo · controles base
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold">Configuración y gobierno</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Ajusta el tenant principal y valida si la operación ya está cerrando
              tenancy, agentes, aprobaciones y evidencia exportable.
            </p>
          </div>
          <div className="flex gap-3">
            <MetricCard label="Tenants" value={String(overview.stats.organizations)} />
            <MetricCard label="Usuarios" value={String(overview.stats.users)} />
            <MetricCard label="Agentes" value={String(overview.stats.agents)} />
            <MetricCard label="Reportes" value={String(overview.stats.reports)} />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-950">Tenant principal</h2>
            <p className="mt-1 text-sm text-slate-500">
              Configuración mínima del tenant visible para owner o admin.
            </p>
          </div>

          {overview.connectionState !== "live" || !overview.organization ? (
            <p className="text-sm text-slate-500">{overview.message}</p>
          ) : (
            <form action={submitOrganizationSettings} className="space-y-3">
              <input type="hidden" name="organizationId" value={overview.organization.id} />

              <Field label="Nombre">
                <input
                  name="name"
                  defaultValue={overview.organization.name}
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="País">
                  <input
                    name="countryCode"
                    defaultValue={overview.organization.countryCode}
                    className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </Field>
                <Field label="Plan">
                  <select
                    name="plan"
                    defaultValue={overview.organization.plan}
                    className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  >
                    <option value="starter">starter</option>
                    <option value="growth">growth</option>
                    <option value="enterprise">enterprise</option>
                  </select>
                </Field>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Zona horaria">
                  <input
                    name="timezone"
                    defaultValue={overview.organization.timezone}
                    className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </Field>
                <Field label="Estado">
                  <select
                    name="status"
                    defaultValue={overview.organization.status}
                    className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </Field>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Guardar configuración base
              </button>
            </form>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-slate-950">Estado de controles</h2>
            <p className="mt-1 text-sm text-slate-500">
              Lectura rápida del cierre operativo actual del tenant.
            </p>

            <div className="mt-4 space-y-3">
              {overview.controls.map((control) => (
                <div
                  key={control.label}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{control.label}</p>
                    <Badge tone={controlTone[control.status]}>{control.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{control.detail}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-semibold text-slate-950">Superficies del ecosistema</h2>
            <p className="mt-1 text-sm text-slate-500">
              Mapa funcional sugerido para `.com`, `.ai` y `.so` dentro de AgentWatch.
            </p>

            <div className="mt-4 space-y-3">
              <SurfaceRow domain=".com" detail="marketing, onboarding y venta enterprise" />
              <SurfaceRow domain=".ai" detail="consola principal de monitoreo y control" />
              <SurfaceRow domain=".so" detail="portal operativo o soporte regional para clientes" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-28 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function SurfaceRow({ domain, detail }: { domain: string; detail: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
      <p className="font-semibold text-slate-950">{domain}</p>
      <p className="text-sm text-slate-600">{detail}</p>
    </div>
  );
}
