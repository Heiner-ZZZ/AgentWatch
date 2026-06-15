import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  submitAgent,
  submitAgentUpdate,
} from "@/features/admin/server/admin-actions";

type AgentsHubProps = {
  overview: Awaited<
    ReturnType<typeof import("@/features/agents/server/get-agents-overview").getAgentsOverview>
  >;
};

const autonomyTone = {
  read_only: "low",
  supervised: "medium",
  limited_write: "high",
  autonomous: "critical",
} as const;

export function AgentsHub({ overview }: AgentsHubProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(125deg,rgba(12,22,44,0.98),rgba(27,43,77,0.94)),radial-gradient(circle_at_top_left,rgba(34,197,94,0.2),transparent_32%)] p-6 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/80">
          FEA-03 · CU-02 · HU-01
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold">Catálogo de agentes</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Registra identidades técnicas, ajusta autonomía operativa y mantén
              credenciales rotables por tenant.
            </p>
          </div>
          <div className="flex gap-3">
            <MetricCard label="Agentes" value={String(overview.stats.total)} />
            <MetricCard label="Activos" value={String(overview.stats.active)} />
            <MetricCard label="Autónomos" value={String(overview.stats.autonomous)} />
            <MetricCard label="Fuentes" value={String(overview.stats.sources)} />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-950">Registrar agente</h2>
            <p className="mt-1 text-sm text-slate-500">
              Crea agentes, bots o automatizaciones y define su nivel de autonomía.
            </p>
          </div>

          {overview.organizations.length === 0 ? (
            <p className="text-sm text-slate-500">{overview.message}</p>
          ) : (
            <form action={submitAgent} className="space-y-3">
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

              <Field label="Nombre">
                <input
                  name="name"
                  required
                  placeholder="CRM Export Monitor"
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Tipo de agente">
                  <input
                    name="agentType"
                    required
                    placeholder="workflow_agent"
                    className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </Field>
                <Field label="Fuente">
                  <input
                    name="source"
                    defaultValue="manual"
                    placeholder="n8n"
                    className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </Field>
              </div>

              <Field label="Descripción">
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Monitorea exportaciones o cambios sensibles."
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Autonomía">
                  <select
                    name="autonomyLevel"
                    defaultValue="supervised"
                    className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  >
                    <option value="read_only">read_only</option>
                    <option value="supervised">supervised</option>
                    <option value="limited_write">limited_write</option>
                    <option value="autonomous">autonomous</option>
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
                Registrar agente
              </button>
            </form>
          )}
        </Card>

        <div className="space-y-4">
          {overview.connectionState === "error" ? (
            <Card className="p-5 text-sm text-rose-700">{overview.message}</Card>
          ) : null}

          {overview.agents.length === 0 && overview.connectionState !== "error" ? (
            <Card className="p-5 text-sm text-slate-500">
              {overview.message ?? "Aún no se han registrado agentes."}
            </Card>
          ) : null}

          {overview.agents.map((agent) => (
            <Card key={agent.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="low">{agent.organizationName}</Badge>
                    <Badge tone={autonomyTone[agent.autonomyLevel]}>
                      {agent.autonomyLevel}
                    </Badge>
                    <Badge tone={agent.status === "active" ? "low" : "medium"}>
                      {agent.status}
                    </Badge>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-950">{agent.name}</h2>
                  <p className="text-sm text-slate-600">
                    {agent.description || "Sin descripción operativa registrada."}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <span>Tipo: {agent.agentType}</span>
                    <span>Fuente: {agent.source}</span>
                    <span>Key: {agent.apiKeyMasked}</span>
                    <span>Actualizado {agent.updatedAtLabel}</span>
                  </div>
                </div>

                <form action={submitAgentUpdate} className="grid min-w-[280px] gap-3 sm:grid-cols-2">
                  <input type="hidden" name="agentId" value={agent.id} />
                  <Field label="Autonomía">
                    <select
                      name="autonomyLevel"
                      defaultValue={agent.autonomyLevel}
                      className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                    >
                      <option value="read_only">read_only</option>
                      <option value="supervised">supervised</option>
                      <option value="limited_write">limited_write</option>
                      <option value="autonomous">autonomous</option>
                    </select>
                  </Field>
                  <Field label="Estado">
                    <select
                      name="status"
                      defaultValue={agent.status}
                      className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                    >
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </select>
                  </Field>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Guardar cambios
                  </button>
                  <a
                    href={`/agents/rotate/${agent.id}`}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-center text-sm font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Rotar y revelar key
                  </a>
                </form>
              </div>
            </Card>
          ))}
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
