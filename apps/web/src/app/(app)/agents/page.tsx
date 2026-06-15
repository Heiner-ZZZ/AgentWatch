import { AgentsHub } from "@/features/agents/components/agents-hub";
import { getAgentsOverview } from "@/features/agents/server/get-agents-overview";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const overview = await getAgentsOverview();

  return <AgentsHub overview={overview} />;
}
