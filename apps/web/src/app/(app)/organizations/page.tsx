import { OrganizationsHub } from "@/features/organizations/components/organizations-hub";
import { getOrganizationsOverview } from "@/features/organizations/server/get-organizations-overview";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const overview = await getOrganizationsOverview();

  return <OrganizationsHub overview={overview} />;
}
