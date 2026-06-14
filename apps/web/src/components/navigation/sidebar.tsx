import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { primaryNavigation } from "@/config/navigation";

export function Sidebar() {
  return (
    <aside className="flex h-full w-full max-w-64 flex-col border-r border-slate-900 bg-slate-950 px-5 py-6 text-slate-100">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-[var(--primary)] p-2 text-white">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            AgentWatch
          </p>
          <p className="text-lg font-semibold">Control Center</p>
        </div>
      </div>

      <nav className="space-y-2">
        {primaryNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
