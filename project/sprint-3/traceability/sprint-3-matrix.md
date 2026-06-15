# Sprint 3 Matrix

## Regla

Cada elemento de Sprint 3 debe poder seguirse desde requerimiento de dashboard operativo hasta evidencia tecnica de timeline y aislamiento multi-tenant.

## Matriz

| Tipo fuente | ID | Elemento | Feature | Backlog item | Evidencia tecnica | Estado |
|---|---|---|---|---|---|---|
| RF | RF-05 | Dashboard de control necesita historial operable | FEA-05 | BLI-005, BLI-105 | `apps/api/test/sprint-3.e2e-spec.ts` + `project/sprint-3/architecture/timeline-query-flow.md` + `project/sprint-3/architecture/dashboard-api-integration.md` | cerrado Sprint 3 |
| RNF | RNF-01 | Rendimiento base de consulta | FEA-05 | BLI-005 | `scripts/db/v1/003_agentwatch_sprint2_events.sql` + consultas filtradas | cerrado para alcance base |
| RNF | RNF-04 | Usabilidad y legibilidad | FEA-05 | BLI-005, BLI-105 | `displaySummary`, `riskLevel`, `status`, detalle + dashboard conectado | cerrado para dashboard principal |
| CU | CU-04 | Consultar timeline filtrado | FEA-05 | BLI-005, BLI-105 | `apps/api/test/sprint-3.e2e-spec.ts` + dashboard server-side | cerrado |
| HU | HU-03 | Ver timeline | FEA-05 | BLI-005, BLI-105 | `apps/api/test/sprint-3.e2e-spec.ts` + dashboard server-side | cerrado |
| Sprint | 24.5 | Timeline operativo y detalle | FEA-05 | BLI-005, BLI-105 | `project/sprint-3/` + test dedicado + frontend conectado | cerrado Sprint 3 |

## Evidencia principal

- `apps/api/test/sprint-3.e2e-spec.ts`
- `apps/api/src/modules/events/controllers/events.controller.ts`
- `apps/api/src/modules/events/services/events.service.ts`
- `apps/api/src/modules/events/dto/list-events-query.dto.ts`
- `apps/api/src/infrastructure/database/repositories/events.repository.ts`
- `project/sprint-3/architecture/timeline-query-flow.md`
- `project/sprint-3/architecture/dashboard-api-integration.md`
