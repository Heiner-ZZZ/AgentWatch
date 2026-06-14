import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-slate-950">Configuracion</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Espacio reservado para dominio, retencion, branding y reglas de riesgo.
      </p>
    </Card>
  );
}
