import type { DashboardOrganizationDto } from "@/features/dashboard/contracts/dashboard-api.contract";
import type { ReportDto } from "@/features/reports/contracts/reports-api.contract";
import type {
  ReportCatalogItem,
  ReportCatalogOverview,
  ReportOrganizationOption,
} from "@/features/reports/models/report-catalog.model";
import { fetchReportOrganizations, fetchReports } from "@/features/reports/server/reports-api";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function toDateInputValue(value: Date) {
  return value.toISOString().slice(0, 10);
}

function mapOrganization(item: DashboardOrganizationDto): ReportOrganizationOption {
  return {
    id: item.id,
    name: item.name,
  };
}

function mapReport(item: ReportDto): ReportCatalogItem {
  return {
    id: item.id,
    organizationId: item.organizationId,
    organizationName: item.organizationName,
    generatedByUserName: item.generatedByUserName,
    fileName: item.fileName,
    executiveSummary: item.executiveSummary,
    periodLabel: `${formatDate(item.periodStart)} - ${formatDate(item.periodEnd)}`,
    createdAtLabel: formatDateTime(item.createdAt),
    eventCount: item.reportPayload.totals?.eventCount ?? 0,
    highRiskCount: item.reportPayload.totals?.highRiskCount ?? 0,
    approvalCount: item.reportPayload.totals?.approvalCount ?? 0,
  };
}

export async function getReportCatalogOverview(): Promise<ReportCatalogOverview> {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  try {
    const organizations = (await fetchReportOrganizations()).map(mapOrganization);
    const selectedOrganizationId = organizations[0]?.id ?? null;
    const selectedOrganizationName =
      organizations.find((organization) => organization.id === selectedOrganizationId)?.name ??
      null;

    if (!selectedOrganizationId) {
      return {
        organizations: [],
        selectedOrganizationId: null,
        selectedOrganizationName: null,
        reports: [],
        connectionState: "empty",
        message: "No hay organizaciones disponibles para generar reportes.",
        defaultPeriodStart: toDateInputValue(sevenDaysAgo),
        defaultPeriodEnd: toDateInputValue(now),
      };
    }

    const reports = (await fetchReports(selectedOrganizationId)).map(mapReport);

    if (reports.length === 0) {
      return {
        organizations,
        selectedOrganizationId,
        selectedOrganizationName,
        reports: [],
        connectionState: "empty",
        message: "Aun no existen reportes generados para esta organizacion.",
        defaultPeriodStart: toDateInputValue(sevenDaysAgo),
        defaultPeriodEnd: toDateInputValue(now),
      };
    }

    return {
      organizations,
      selectedOrganizationId,
      selectedOrganizationName,
      reports,
      connectionState: "live",
      message: null,
      defaultPeriodStart: toDateInputValue(sevenDaysAgo),
      defaultPeriodEnd: toDateInputValue(now),
    };
  } catch (error) {
    return {
      organizations: [],
      selectedOrganizationId: null,
      selectedOrganizationName: null,
      reports: [],
      connectionState: "error",
      message:
        error instanceof Error
          ? error.message
          : "No se pudo consultar el catalogo de reportes.",
      defaultPeriodStart: toDateInputValue(sevenDaysAgo),
      defaultPeriodEnd: toDateInputValue(now),
    };
  }
}
