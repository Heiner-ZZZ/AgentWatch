# Report Generation Flow

## Objetivo

Documentar el flujo implementado de Sprint 6 para convertir actividad operativa en reporte ejecutivo exportable.

## Flujo implementado

1. Un usuario autenticado con rol `owner`, `admin`, `auditor` u `operator` solicita `POST /api/v1/reports/generate`.
2. `ReportsService` valida tenancy y el rango de fechas.
3. `EventsRepository.findForReport` consulta eventos reales del tenant en PostgreSQL.
4. `ApprovalsRepository.findByEventIds` recupera aprobaciones relacionadas para el mismo conjunto de eventos.
5. `ReportsService` construye un payload con totales, riesgos, aprobaciones, tipos de evento y highlights.
6. `ReportPdfService` genera un PDF simple a partir del resumen ejecutivo y del anexo tecnico compacto.
7. `ReportsRepository` persiste metadata, payload y contenido base64 en la tabla `reports`.
8. `AuditService` registra `report.generated`.
9. El API expone `GET /api/v1/reports`, `GET /api/v1/reports/:id` y `GET /api/v1/reports/:id/download`.
10. La pagina web `/reports` consume el API real, muestra historial y permite descargar el PDF via route handler server-side.

## Controles activos

- aislamiento por `organization_id`;
- validacion de rango temporal;
- acceso restringido a usuarios del tenant;
- auditoria de generacion de reporte;
- contenido basado en eventos y aprobaciones persistidos, no mocks.

## Lo que Sprint 6 no promete aun

- firma digital o sellado criptografico;
- branding por cliente;
- reportes programados;
- plantillas multiples por industria;
- almacenamiento externo de binarios.

## Evidencia tecnica

- `apps/api/src/modules/reports/services/reports.service.ts`
- `apps/api/src/modules/reports/controllers/reports.controller.ts`
- `apps/api/src/modules/reports/services/report-pdf.service.ts`
- `apps/api/src/infrastructure/database/schema/reports.schema.ts`
- `apps/api/src/infrastructure/database/repositories/reports.repository.ts`
- `apps/api/test/sprint-6.e2e-spec.ts`
- `apps/web/src/features/reports/server/reports-api.ts`
- `apps/web/src/features/reports/server/get-report-catalog-overview.ts`
- `apps/web/src/features/reports/components/report-catalog.tsx`
