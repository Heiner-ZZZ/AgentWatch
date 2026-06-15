# Backlog Committed

## Fuente

- `project/planning/backlog-items.md`
- `project/planning/features.md`
- `project/planning/sprints/sprint-3.md`

## Item comprometido

| ID | Item | Feature | Estado | Evidencia |
|---|---|---|---|---|
| BLI-005 | Timeline filtrable por tenant | FEA-05 | cerrado Sprint 3 | `apps/api/test/sprint-3.e2e-spec.ts` |
| BLI-105 | Dashboard conectado a API real | FEA-05 | cerrado Sprint 3 extendido | `apps/web/src/features/dashboard/server/get-dashboard-overview.ts` |

## Definition of Done del sprint

- el usuario autenticado consulta timeline de su tenant;
- puede filtrar por organizacion, agente, fecha, tipo, riesgo y estado;
- puede abrir detalle de evento;
- no puede acceder a eventos de otras organizaciones;
- el dashboard principal deja de depender de mocks y consume el API real.

## Deuda abierta que no bloquea el cierre

- paginacion formal;
- filtros de texto o agrupaciones avanzadas;
- conexion real en vistas adicionales fuera del dashboard principal
