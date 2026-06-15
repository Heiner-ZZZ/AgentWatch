"use server";

import { generateReport } from "@/features/reports/server/reports-api";

export async function submitReportGeneration(formData: FormData) {
  const organizationId = String(formData.get("organizationId") ?? "");
  const periodStart = String(formData.get("periodStart") ?? "");
  const periodEnd = String(formData.get("periodEnd") ?? "");

  if (!organizationId || !periodStart || !periodEnd) {
    throw new Error("Invalid report generation payload.");
  }

  await generateReport({
    organizationId,
    periodStart: `${periodStart}T00:00:00.000Z`,
    periodEnd: `${periodEnd}T23:59:59.999Z`,
  });
}
