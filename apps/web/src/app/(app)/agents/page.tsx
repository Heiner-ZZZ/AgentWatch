import { Card } from "@/components/ui/card";

export default function AgentsPage() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-slate-950">Agentes</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Estructura preparada para catalogo de agentes, sesiones, autonomia e
        integraciones por organizacion.
      </p>
    </Card>
  );
}
