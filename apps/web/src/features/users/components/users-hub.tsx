import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { submitUser } from "@/features/admin/server/admin-actions";

type UsersHubProps = {
  overview: Awaited<
    ReturnType<typeof import("@/features/users/server/get-users-overview").getUsersOverview>
  >;
};

const roleTone = {
  owner: "critical",
  admin: "high",
  operator: "medium",
  auditor: "medium",
  viewer: "low",
  integrator: "high",
} as const;

export function UsersHub({ overview }: UsersHubProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(130deg,rgba(15,23,42,0.96),rgba(51,65,85,0.92)),radial-gradient(circle_at_top_right,rgba(56,189,248,0.25),transparent_35%)] p-6 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/80">
          FEA-02 · HU soporte transversal
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold">Usuarios, roles y responsables</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Controla quién accede al dashboard, con qué rol y bajo qué tenant
              opera dentro del flujo trazable de AgentWatch.
            </p>
          </div>
          <div className="flex gap-3">
            <MetricCard label="Usuarios" value={String(overview.stats.total)} />
            <MetricCard label="Activos" value={String(overview.stats.active)} />
            <MetricCard label="Roles críticos" value={String(overview.stats.privileged)} />
            <MetricCard label="Tenants" value={String(overview.stats.organizations)} />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-950">Alta de usuario</h2>
            <p className="mt-1 text-sm text-slate-500">
              Crea responsables, auditores, operadores o integradores por organización.
            </p>
          </div>

          {overview.organizations.length === 0 ? (
            <p className="text-sm text-slate-500">{overview.message}</p>
          ) : (
            <form action={submitUser} className="space-y-3">
              <Field label="Organización">
                <select
                  name="organizationId"
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                >
                  {overview.organizations.map((organization) => (
                    <option key={organization.id} value={organization.id}>
                      {organization.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Nombre completo">
                <input
                  name="fullName"
                  required
                  placeholder="María Operaciones"
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              </Field>

              <Field label="Email">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="maria@empresa.com"
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              </Field>

              <Field label="Password inicial">
                <input
                  name="password"
                  required
                  minLength={4}
                  placeholder="mínimo 4 caracteres"
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Rol">
                  <select
                    name="role"
                    defaultValue="viewer"
                    className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  >
                    <option value="owner">owner</option>
                    <option value="admin">admin</option>
                    <option value="operator">operator</option>
                    <option value="auditor">auditor</option>
                    <option value="viewer">viewer</option>
                    <option value="integrator">integrator</option>
                  </select>
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
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Crear usuario
              </button>
            </form>
          )}
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-950">Roster operativo</h2>
            <p className="text-sm text-slate-500">
              Vista cruzada de acceso, tenant y rol para responsables del sistema.
            </p>
          </div>

          {overview.connectionState === "error" ? (
            <p className="px-5 py-6 text-sm text-rose-700">{overview.message}</p>
          ) : null}

          {overview.users.length === 0 && overview.connectionState !== "error" ? (
            <p className="px-5 py-6 text-sm text-slate-500">
              {overview.message ?? "Aún no hay usuarios adicionales creados."}
            </p>
          ) : null}

          {overview.users.length > 0 ? (
            <div className="divide-y divide-[var(--border)]">
              {overview.users.map((user) => (
                <div
                  key={`${user.organizationId}:${user.id}:${user.role}`}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1fr)]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-950">{user.fullName}</p>
                      <Badge tone={roleTone[user.role]}>{user.role}</Badge>
                      <Badge tone={user.status === "active" ? "low" : "medium"}>
                        {user.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                  </div>

                  <DataCell label="Organización" value={user.organizationName} />
                  <DataCell label="Rol" value={user.role} />
                  <DataCell label="Estado" value={user.status} />
                  <DataCell label="Alta" value={user.createdAtLabel} />
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
