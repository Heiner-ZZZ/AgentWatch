export type ReportsApiEnvelope<T> = {
  message: string | null;
  data: T;
};

export type ReportDto = {
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
  reportPayload: {
    totals?: {
      eventCount?: number;
      highRiskCount?: number;
      failedCount?: number;
      approvalCount?: number;
    };
    approvals?: {
      pending?: number;
      approved?: number;
      rejected?: number;
    };
    eventTypes?: Array<{
      label: string;
      count: number;
    }>;
  };
  createdAt: string;
};
