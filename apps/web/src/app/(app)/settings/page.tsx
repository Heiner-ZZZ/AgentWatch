import { SettingsPanel } from "@/features/settings/components/settings-panel";
import { getSettingsOverview } from "@/features/settings/server/get-settings-overview";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const overview = await getSettingsOverview();

  return <SettingsPanel overview={overview} />;
}
