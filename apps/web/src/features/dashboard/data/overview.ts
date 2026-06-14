export const dashboardStats = [
  { label: "Eventos hoy", value: "1,284", tone: "low" as const },
  { label: "Aprobaciones pendientes", value: "12", tone: "medium" as const },
  { label: "Riesgos altos", value: "3", tone: "high" as const },
  { label: "Reportes generados", value: "28", tone: "low" as const },
];

export const recentEvents = [
  {
    id: "evt-1001",
    agent: "n8n Leads MX",
    action: "Envio 18 correos de seguimiento",
    risk: "medium" as const,
    source: "gmail",
  },
  {
    id: "evt-1002",
    agent: "Codex Ops",
    action: "Modifico configuracion de despliegue",
    risk: "high" as const,
    source: "github",
  },
  {
    id: "evt-1003",
    agent: "Sheets Sync",
    action: "Actualizo 43 registros en CRM",
    risk: "low" as const,
    source: "sheets",
  },
];
