import Link from "next/link";

export default function MarketingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          AgentWatch
        </p>
        <h1 className="text-5xl font-semibold leading-tight text-slate-950 md:text-6xl">
          Observabilidad enterprise para agentes AI y automatizaciones.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Historial entendible en espanol, alertas, aprobaciones, reportes y
          trazabilidad para integradores, PYMEs y equipos operativos.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="rounded-full bg-[var(--primary)] px-6 py-3 font-medium text-white"
          >
            Abrir dashboard
          </Link>
          <Link
            href="/reports"
            className="rounded-full border border-[var(--border)] bg-white px-6 py-3 font-medium text-slate-900"
          >
            Ver reportes
          </Link>
        </div>
      </div>
    </main>
  );
}
