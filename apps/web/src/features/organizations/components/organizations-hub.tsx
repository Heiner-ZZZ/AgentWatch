import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { submitOrganization } from "@/features/admin/server/admin-actions";

type OrganizationsHubProps = {
  overview: Awaited<ReturnType<typeof import("@/features/organizations/server/get-organizations-overview").getOrganizationsOverview>>;
};

export function OrganizationsHub({ overview }: OrganizationsHubProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.95)),radial-gradient(circle_at_top_left,rgba(45,212,191,0.28),transparent_35%)] p-6 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
          FEA-01 · CU-01
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold">Organizaciones y tenancy</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Superficie operativa para crear y revisar tenants, contexto regional
              y plan activo por cliente u organización monitoreada.
            </p>
          </div>
          <div className="flex gap-3">
            <MetricCard label="Tenants visibles" value={String(overview.stats.total)} />
            <MetricCard label="Activos" value={String(overview.stats.active)} />
            <MetricCard label="Planes" value={String(overview.stats.plans)} />
            <MetricCard label="Países" value={String(overview.stats.countries)} />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-950">Alta de organización</h2>
            <p className="mt-1 text-sm text-slate-500">
              Crea un tenant operativo con plan, región y estado inicial.
            </p>
          </div>

          <form action={submitOrganization} className="space-y-3">
            <Field label="Nombre">
              <input
                name="name"
                required
                placeholder="AgentWatch Latam"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="País">
                <input
                  name="countryCode"
                  defaultValue="EC"
                  maxLength={2}
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              </Field>
              <Field label="Plan">
                <select
                  name="plan"
                  defaultValue="starter"
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                >
                  <option value="starter">starter</option>
                  <option value="growth">growth</option>
                  <option value="enterprise">enterprise</option>
                </select>
              </Field>
            </div>

            <Field label="Zona horaria">
              <input
                name="timezone"
                defaultValue="America/Guayaquil"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
              />
            </Field>

            <Field label="Estado">
              <select
                name="status"
                defaultValue="active"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </Field>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Crear tenant
            </button>
          </form>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-950">Registro de organizaciones</h2>
            <p className="text-sm text-slate-500">
              Vista transversal del tenancy disponible para el usuario autenticado.
            </p>
          </div>

          {overview.connectionState === "error" ? (
            <p className="px-5 py-6 text-sm text-rose-700">{overview.message}</p>
          ) : null}

          {overview.connectionState === "empty" ? (
            <p className="px-5 py-6 text-sm text-slate-500">{overview.message}</p>
          ) : null}

          {overview.organizations.length > 0 ? (
            <div className="divide-y divide-[var(--border)]">
              {overview.organizations.map((organization) => (
                <div
                  key={organization.id}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-950">
                        {organization.name}
                      </p>
                      <Badge tone={organization.status === "active" ? "low" : "medium"}>
                        {organization.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      ID {organization.id.slice(0, 8)} · Actualizado {organization.updatedAtLabel}
                    </p>
                  </div>

                  <DataCell label="País" value={organization.countryCode} />
                  <DataCell label="Zona horaria" value={organization.timezone} />
                  <DataCell label="Plan" value={organization.plan} />
                  <DataCell label="Creado" value={organization.createdAtLabel} />
                  <DataCell
                    label="Cobertura"
                    value={organization.status === "active" ? "Monitoreo habilitado" : "En pausa"}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </Card>
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

function DataCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
