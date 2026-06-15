import { UsersHub } from "@/features/users/components/users-hub";
import { getUsersOverview } from "@/features/users/server/get-users-overview";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const overview = await getUsersOverview();

  return <UsersHub overview={overview} />;
}
