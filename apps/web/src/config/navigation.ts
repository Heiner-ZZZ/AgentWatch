import type { ComponentType } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  Bot,
  ClipboardCheck,
  BarChart3,
  Settings,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const primaryNavigation: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/organizations", label: "Organizaciones", icon: Building2 },
  { href: "/users", label: "Usuarios", icon: Users },
  { href: "/agents", label: "Agentes", icon: Bot },
  { href: "/approvals", label: "Aprobaciones", icon: ClipboardCheck },
  { href: "/reports", label: "Reportes", icon: BarChart3 },
  { href: "/settings", label: "Configuración", icon: Settings },
];
