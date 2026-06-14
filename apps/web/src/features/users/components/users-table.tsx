import { Card } from "@/components/ui/card";
import { users } from "@/features/users/data/users";

export function UsersTable() {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-950">Usuarios</h2>
        <p className="text-sm text-[var(--muted)]">
          Acceso, roles y responsables operativos por organizacion.
        </p>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {users.map((user) => (
          <div key={user.id} className="grid gap-3 px-5 py-4 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Nombre
              </p>
              <p className="mt-1 font-medium text-slate-900">{user.fullName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Email
              </p>
              <p className="mt-1 font-medium text-slate-900">{user.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Rol
              </p>
              <p className="mt-1 font-medium text-slate-900">{user.role}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
