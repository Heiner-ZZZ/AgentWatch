# Backlog Committed

## Fuente

- `project/planning/backlog-items.md`
- `project/planning/features.md`
- `project/planning/sprints/sprint-5.md`

## Items comprometidos

| ID | Item | Feature | Estado | Evidencia |
|---|---|---|---|---|
| BLI-008 | Crear aprobacion al detectar riesgo alto | FEA-08 | cerrado Sprint 5 | `apps/api/test/sprint-5.e2e-spec.ts` |
| BLI-009 | Vista de aprobaciones pendientes | FEA-08 | cerrado Sprint 5 | `apps/web/src/features/approvals/components/approval-queue.tsx` |

## Definition of Done del sprint

- un evento `high` o `critical` crea aprobacion;
- un usuario autorizado puede aprobar o rechazar;
- la decision queda trazable;
- el evento refleja el resultado;
- la vista principal de aprobaciones consume el API real.

## Deuda abierta que no bloquea el cierre

- expiracion de aprobaciones;
- escalamiento multinivel;
- notificacion automatica por decision
