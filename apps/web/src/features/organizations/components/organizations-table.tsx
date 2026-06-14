import { Card } from "@/components/ui/card";
import { organizations } from "@/features/organizations/data/organizations";

export function OrganizationsTable() {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-950">Organizaciones</h2>
        <p className="text-sm text-[var(--muted)]">
          Clientes y workspaces monitoreados por AgentWatch.
        </p>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {organizations.map((organization) => (
          <div
            key={organization.id}
            className="grid gap-3 px-5 py-4 md:grid-cols-4"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Nombre
              </p>
              <p className="mt-1 font-medium text-slate-900">{organization.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Pais
              </p>
              <p className="mt-1 font-medium text-slate-900">{organization.countryCode}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Zona horaria
              </p>
              <p className="mt-1 font-medium text-slate-900">{organization.timezone}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Plan
              </p>
              <p className="mt-1 font-medium text-slate-900">{organization.plan}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
