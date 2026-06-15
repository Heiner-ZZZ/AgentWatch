import { Search, Bell } from "lucide-react"

export function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <span className="text-slate-900">Dashboard</span>
        </nav>
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
        <button className="relative rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
          <Bell className="size-4" />
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[var(--primary)] text-[9px] font-medium text-white">
            3
          </span>
        </button>
      </div>
    </header>
  )
}
