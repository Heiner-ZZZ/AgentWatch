"use server";

import { decideApproval } from "@/features/approvals/server/approvals-api";

export async function submitApprovalDecision(formData: FormData) {
  const approvalId = String(formData.get("approvalId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const comment = String(formData.get("comment") ?? "");

  if (!approvalId || (decision !== "approve" && decision !== "reject")) {
    throw new Error("Invalid approval decision payload.");
  }

  await decideApproval({
    approvalId,
    decision,
    comment,
  });
}
