import Link from "next/link"
import { ArrowRight, ShieldCheck, AlertTriangle, BarChart3, History } from "lucide-react"

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-in-up mb-6 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-medium text-blue-700">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
            </span>
            Open Source · MIT
          </div>

          <h1 className="animate-fade-in-up animate-delay-100 text-5xl font-semibold leading-tight tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
            Observabilidad enterprise para{" "}
            <span className="bg-gradient-to-r from-[var(--primary)] to-blue-400 bg-clip-text text-transparent">
              agentes AI
            </span>{" "}
            y automatizaciones.
          </h1>

          <p className="animate-fade-in-up animate-delay-200 mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
            Historial entendible en español, alertas, aprobaciones, reportes y
            trazabilidad para integradores, PYMEs y equipos operativos.
          </p>

          <div className="animate-fade-in-up animate-delay-300 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-6 text-sm font-medium text-white transition-all hover:opacity-90"
            >
              Ir al dashboard
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="https://github.com"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Ver en GitHub
            </Link>
          </div>
        </div>

        <div className="animate-fade-in-up animate-delay-500 mt-16">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-b from-[var(--primary)]/10 via-blue-100/50 to-transparent blur-2xl" />
            <div className="relative rounded-xl border border-slate-200 bg-white p-2 shadow-2xl shadow-blue-900/10">
              <div className="rounded-lg border border-slate-100 bg-slate-950 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="size-2.5 rounded-full bg-red-500" />
                    <div className="size-2.5 rounded-full bg-yellow-500" />
                    <div className="size-2.5 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-slate-500">dashboard</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { icon: ShieldCheck, label: "Agentes activos", value: "12", color: "text-blue-400" },
                    { icon: AlertTriangle, label: "Alertas", value: "3", color: "text-amber-400" },
                    { icon: History, label: "Trazas hoy", value: "1,284", color: "text-emerald-400" },
                    { icon: BarChart3, label: "Aprobaciones", value: "7", color: "text-violet-400" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg bg-slate-900 p-3">
                      <div className="flex items-center gap-2">
                        <item.icon className={`size-3.5 ${item.color}`} />
                        <span className="text-xs text-slate-400">{item.label}</span>
                      </div>
                      <p className="mt-1.5 text-lg font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-32 rounded-lg bg-slate-900/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
