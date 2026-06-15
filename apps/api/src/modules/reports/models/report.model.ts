export type ReportModel = {
  id: string;
  organizationId: string;
  organizationName: string;
  generatedByUserId: string;
  generatedByUserName: string;
  periodStart: string;
  periodEnd: string;
  fileName: string;
  mimeType: string;
  executiveSummary: string;
  reportPayload: Record<string, unknown>;
  createdAt: string;
};
