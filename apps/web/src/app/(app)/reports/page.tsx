import { ReportCatalog } from "@/features/reports/components/report-catalog";
import { getReportCatalogOverview } from "@/features/reports/server/get-report-catalog-overview";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const overview = await getReportCatalogOverview();

  return <ReportCatalog overview={overview} />;
}
