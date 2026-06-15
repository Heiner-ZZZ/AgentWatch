import Link from "next/link"
import { ShieldCheck } from "lucide-react"

const footerLinks = [
  {
    title: "Producto",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Precios", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
      { label: "API", href: "/docs/api" },
    ],
  },
  {
    title: "Documentación",
    links: [
      { label: "Guía de inicio", href: "/docs" },
      { label: "SDK", href: "/docs/sdk" },
      { label: "OpenTelemetry", href: "/docs/otel" },
      { label: "MCP Server", href: "/docs/mcp" },
    ],
  },
  {
    title: "Compañía",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Comunidad", href: "/community" },
      { label: "Términos", href: "/terms" },
      { label: "Privacidad", href: "/privacy" },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 inline-flex items-center gap-2 font-semibold text-white">
              <ShieldCheck className="size-5 text-[var(--primary)]" />
              AgentWatch
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Observabilidad, aprobaciones y reportes para agentes AI y automatizaciones.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-800 px-3 py-1 text-xs text-slate-500">
              <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Open Source MIT
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="mb-3 text-sm font-semibold text-white">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs text-slate-600">
          AgentWatch Data S.L. {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  )
}
