# Sprint 2 Matrix

## Regla

Cada elemento de Sprint 2 debe poder seguirse desde requerimiento y modelo de eventos hasta evidencia tecnica.

## Matriz

| Tipo fuente | ID | Elemento | Feature | Backlog item | Evidencia tecnica | Estado |
|---|---|---|---|---|---|---|
| RF | RF-05 | Dashboard de control necesita historial | FEA-04 | BLI-004 | `apps/api/test/sprint-2.e2e-spec.ts` + `project/sprint-2/architecture/event-ingestion-flow.md` | cerrado Sprint 2 |
| RNF | RNF-01 | Rendimiento base de consulta futura | FEA-04 | BLI-004 | `scripts/db/v1/003_agentwatch_sprint2_events.sql` | cerrado Sprint 2 |
| RNF | RNF-02 | Seguridad y privacidad | FEA-04 | BLI-004 | API key + aislamiento por organizacion + idempotencia por tenant | cerrado Sprint 2 |
| CU | CU-03 | Enviar evento por API o webhook | FEA-04 | BLI-004 | `apps/api/test/sprint-2.e2e-spec.ts` | cerrado |
| HU | HU-02 | Enviar evento | FEA-04 | BLI-004 | `apps/api/test/sprint-2.e2e-spec.ts` | cerrado |
| Sprint | 24.4 | API de eventos | FEA-04 | BLI-004 | `project/sprint-2/` + test dedicado | cerrado |

## Evidencia principal

- `apps/api/test/sprint-2.e2e-spec.ts`
- `project/sprint-2/architecture/event-ingestion-flow.md`
- `scripts/db/v1/003_agentwatch_sprint2_events.sql`
- `apps/api/src/modules/events/*`
- `apps/api/src/infrastructure/database/repositories/events.repository.ts`
