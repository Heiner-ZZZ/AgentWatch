 "use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"

const sectionLabels: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Monitoreo operativo en tiempo real",
  },
  "/organizations": {
    title: "Organizaciones",
    subtitle: "Tenancy, región y plan por cliente",
  },
  "/users": {
    title: "Usuarios",
    subtitle: "Accesos, roles y responsables",
  },
  "/agents": {
    title: "Agentes",
    subtitle: "Identidad técnica, autonomía y rotación de credenciales",
  },
  "/approvals": {
    title: "Aprobaciones",
    subtitle: "Control humano sobre acciones sensibles",
  },
  "/reports": {
    title: "Reportes",
    subtitle: "Evidencia ejecutiva y exportable",
  },
  "/settings": {
    title: "Configuración",
    subtitle: "Gobierno base del tenant y superficies del producto",
  },
}

export function Topbar() {
  const pathname = usePathname()
  const section = useMemo(() => {
    return (
      Object.entries(sectionLabels).find(([path]) =>
        pathname === path || pathname.startsWith(`${path}/`),
      )?.[1] ?? sectionLabels["/dashboard"]
    )
  }, [pathname])

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{section.title}</p>
          <p className="text-xs text-slate-500">{section.subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar trazas, agentes..."
            className="h-8 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-600 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-slate-500">
          tenant console
        </div>
      </div>
    </header>
  )
}
