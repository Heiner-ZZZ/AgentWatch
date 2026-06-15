# Backlog Committed

## Fuente

- `project/planning/backlog-items.md`
- `project/planning/features.md`
- `project/planning/sprints/sprint-2.md`

## Item comprometido

| ID | Item | Feature | Estado | Evidencia |
|---|---|---|---|---|
| BLI-004 | Ingesta de eventos con idempotencia | FEA-04 | cerrado Sprint 2 | `apps/api/test/sprint-2.e2e-spec.ts` |

## Definition of Done del sprint

- un agente autenticado puede enviar eventos;
- el evento se valida y persiste;
- duplicados por `idempotency_key` se controlan;
- metadata y sensitive flags se almacenan;
- la atribucion por tenant y agente se mantiene.

## Deuda abierta que no bloquea el cierre

- `BLI-103 Bulk events`
- `BLI-104 Webhook provider endpoint`
- pipeline async o cola formal
