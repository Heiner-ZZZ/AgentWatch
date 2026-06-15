import { ApprovalQueue } from "@/features/approvals/components/approval-queue";
import { getApprovalQueueOverview } from "@/features/approvals/server/get-approval-queue-overview";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const overview = await getApprovalQueueOverview();

  return <ApprovalQueue overview={overview} />;
}
