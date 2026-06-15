# Backlog Committed

## Fuente

- `project/planning/backlog-items.md`
- `project/planning/features.md`
- `project/planning/sprints/sprint-4.md`

## Items comprometidos

| ID | Item | Feature | Estado | Evidencia |
|---|---|---|---|---|
| BLI-006 | Resumen en espanol por plantilla | FEA-06 | cerrado Sprint 4 | `apps/api/src/modules/events/services/business-summary.service.spec.ts` |
| BLI-007 | Riesgo low medium high critical | FEA-07 | cerrado Sprint 4 | `apps/api/src/modules/events/services/risk-classification.service.spec.ts` |

## Definition of Done del sprint

- un evento tecnico se presenta en lenguaje de negocio cuando aplica;
- el fallback no expone detalles sensibles;
- el riesgo queda persistido;
- `requires_approval` y `status` responden al riesgo calculado.

## Deuda abierta que no bloquea el cierre

- motor de reglas configurable;
- razones de riesgo expuestas de forma estructurada;
- calibracion historica o anomalica
