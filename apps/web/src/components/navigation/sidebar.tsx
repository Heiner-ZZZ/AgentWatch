"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react"
import { primaryNavigation } from "@/config/navigation"
import { cn } from "@/lib/utils"

type SidebarProps = {
  currentUser: {
    fullName: string | null
    email: string | null
  }
}

export function Sidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const initials = (currentUser.fullName ?? "AW")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-slate-800 bg-slate-950 text-slate-400 transition-all duration-200",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className={cn("flex items-center border-b border-slate-800 px-4 py-4", collapsed ? "justify-center" : "gap-3")}>
        <div className="flex shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] p-1.5 text-white">
          <ShieldCheck className="size-4" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              AgentWatch
            </p>
            <p className="truncate text-sm font-medium text-white">Control Center</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {primaryNavigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className={cn("border-t border-slate-800 px-3 py-3", collapsed && "px-2")}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-slate-800 text-xs font-medium text-white">
              {initials}
            </div>
            <button
              onClick={() => setCollapsed(false)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-white"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-medium text-white">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {currentUser.fullName ?? "Sesión AgentWatch"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {currentUser.email ?? "Credenciales del dashboard configuradas por entorno"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="rounded-lg bg-slate-900/70 px-2.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                sesión autenticada
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="ml-auto rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-white"
              >
                <ChevronLeft className="size-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
