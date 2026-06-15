# Sprint 6 Matrix

## Regla

Cada elemento de Sprint 6 debe poder seguirse desde requerimiento o HU hasta el PDF generado y su evidencia persistida.

## Matriz

| Tipo fuente | ID | Elemento | Feature | Backlog item | Evidencia tecnica | Estado |
|---|---|---|---|---|---|---|
| RF | RF-04 | Reporte exportable | FEA-09 | BLI-010 | `apps/api/test/sprint-6.e2e-spec.ts` + `project/sprint-6/architecture/report-generation-flow.md` | cerrado Sprint 6 |
| RNF | RNF-04 | Usabilidad | FEA-09 | BLI-010 | pagina `/reports` conectada al API real y descarga directa | cerrado para alcance Sprint 6 |
| CU | CU-08 | Generar y compartir reporte | FEA-09 | BLI-010 | `apps/api/test/sprint-6.e2e-spec.ts` | cerrado |
| HU | HU-06 | Generar reporte | FEA-09 | BLI-010 | `apps/api/test/sprint-6.e2e-spec.ts` + `apps/web/src/features/reports/components/report-catalog.tsx` | cerrado |
| Sprint | 24.8 | Reportes PDF | FEA-09 | BLI-010 | `project/sprint-6/` + flujo web/API | cerrado Sprint 6 |

## Evidencia principal

- `apps/api/src/modules/reports/services/reports.service.ts`
- `apps/api/src/modules/reports/controllers/reports.controller.ts`
- `apps/api/src/modules/reports/services/report-pdf.service.ts`
- `apps/api/src/infrastructure/database/schema/reports.schema.ts`
- `apps/api/src/infrastructure/database/repositories/reports.repository.ts`
- `apps/api/test/sprint-6.e2e-spec.ts`
- `apps/web/src/features/reports/server/reports-api.ts`
- `apps/web/src/features/reports/components/report-catalog.tsx`
