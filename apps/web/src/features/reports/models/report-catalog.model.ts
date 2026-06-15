export type ReportCatalogItem = {
  id: string;
  organizationId: string;
  organizationName: string;
  generatedByUserName: string;
  fileName: string;
  executiveSummary: string;
  periodLabel: string;
  createdAtLabel: string;
  eventCount: number;
  highRiskCount: number;
  approvalCount: number;
};

export type ReportOrganizationOption = {
  id: string;
  name: string;
};

export type ReportCatalogOverview = {
  organizations: ReportOrganizationOption[];
  selectedOrganizationId: string | null;
  selectedOrganizationName: string | null;
  reports: ReportCatalogItem[];
  connectionState: 'live' | 'empty' | 'error';
  message: string | null;
  defaultPeriodStart: string;
  defaultPeriodEnd: string;
};
