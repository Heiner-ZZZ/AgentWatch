# Sprint 4 Matrix

## Regla

Cada elemento de Sprint 4 debe poder seguirse desde requisito de explicacion/riesgo hasta evidencia tecnica y pruebas dedicadas.

## Matriz

| Tipo fuente | ID | Elemento | Feature | Backlog item | Evidencia tecnica | Estado |
|---|---|---|---|---|---|---|
| RF | RF-02 | Explicacion en lenguaje natural | FEA-06 | BLI-006 | `apps/api/src/modules/events/services/business-summary.service.ts` + `business-summary.service.spec.ts` | cerrado Sprint 4 |
| RF | RF-03 | Alertas y bloqueos por riesgo | FEA-07 | BLI-007 | `apps/api/src/modules/events/services/risk-classification.service.ts` + `risk-classification.service.spec.ts` | cerrado Sprint 4 base |
| RNF | RNF-02 | Seguridad y privacidad | FEA-06, FEA-07 | BLI-006, BLI-007 | resumen seguro + reglas por sensibilidad | cerrado para alcance Sprint 4 |
| RNF | RNF-04 | Usabilidad | FEA-06 | BLI-006 | `business_summary` consumible en timeline | cerrado |
| CU | CU-05 | Interpretar actividad en lenguaje de negocio | FEA-06 | BLI-006 | `apps/api/test/sprint-4.e2e-spec.ts` | cerrado |
| CU | CU-06 | Detectar y clasificar riesgo | FEA-07 | BLI-007 | `apps/api/test/sprint-4.e2e-spec.ts` | cerrado |
| HU | HU-04 | Detectar riesgo | FEA-06, FEA-07 | BLI-006, BLI-007 | pruebas unitarias + e2e dedicado | cerrado |
| Sprint | 24.6 | Resumen y riesgo | FEA-06, FEA-07 | BLI-006, BLI-007 | `project/sprint-4/` + `apps/api/test/sprint-4.e2e-spec.ts` | cerrado Sprint 4 |

## Evidencia principal

- `apps/api/src/modules/events/services/business-summary.service.ts`
- `apps/api/src/modules/events/services/risk-classification.service.ts`
- `apps/api/src/modules/events/use-cases/create-event.use-case.ts`
- `apps/api/src/modules/events/services/business-summary.service.spec.ts`
- `apps/api/src/modules/events/services/risk-classification.service.spec.ts`
- `apps/api/test/sprint-4.e2e-spec.ts`
