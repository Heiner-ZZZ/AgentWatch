export function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] bg-white/80 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          Operaciones
        </p>
        <h1 className="text-xl font-semibold text-slate-900">
          AgentWatch Workspace
        </h1>
      </div>
      <div className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--muted)]">
        Ecuador / America/Guayaquil
      </div>
    </header>
  );
}
