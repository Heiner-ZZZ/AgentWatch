import { createReportsDownloadSession } from "@/features/reports/server/reports-api";

export async function GET(
  request: Request,
  context: { params: Promise<{ reportId: string }> },
) {
  const { reportId } = await context.params;
  const { token, url } = await createReportsDownloadSession(reportId);

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return new Response("No se pudo descargar el reporte.", {
      status: response.status,
    });
  }

  const contentType = response.headers.get("content-type") ?? "application/pdf";
  const contentDisposition =
    response.headers.get("content-disposition") ?? `attachment; filename="${reportId}.pdf"`;
  const fileBuffer = await response.arrayBuffer();

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
      "Cache-Control": "no-store",
    },
  });
}
