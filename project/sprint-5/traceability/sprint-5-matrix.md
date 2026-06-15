# Sprint 5 Matrix

## Regla

Cada elemento de Sprint 5 debe poder seguirse desde riesgo detectado hasta resolucion humana y auditoria.

## Matriz

| Tipo fuente | ID | Elemento | Feature | Backlog item | Evidencia tecnica | Estado |
|---|---|---|---|---|---|---|
| RF | RF-03 | Alertas y bloqueos | FEA-08 | BLI-008, BLI-009 | `apps/api/test/sprint-5.e2e-spec.ts` + `project/sprint-5/architecture/approvals-flow.md` | cerrado Sprint 5 |
| RNF | RNF-02 | Seguridad y privacidad | FEA-08 | BLI-008, BLI-009 | control por rol + tenant isolation + auditoria | cerrado para alcance Sprint 5 |
| CU | CU-07 | Aprobar o rechazar accion delicada | FEA-08 | BLI-008, BLI-009 | `apps/api/test/sprint-5.e2e-spec.ts` | cerrado |
| HU | HU-05 | Aprobar accion | FEA-08 | BLI-008, BLI-009 | `apps/api/test/sprint-5.e2e-spec.ts` + `/approvals` conectada | cerrado |
| Sprint | 24.7 | Aprobaciones humanas | FEA-08 | BLI-008, BLI-009 | `project/sprint-5/` + flujo web/API | cerrado Sprint 5 |

## Evidencia principal

- `apps/api/src/modules/approvals/services/approvals.service.ts`
- `apps/api/src/modules/approvals/controllers/approvals.controller.ts`
- `apps/api/src/infrastructure/database/schema/approvals.schema.ts`
- `apps/api/src/infrastructure/database/repositories/approvals.repository.ts`
- `apps/api/test/sprint-5.e2e-spec.ts`
- `apps/web/src/features/approvals/server/approvals-api.ts`
- `apps/web/src/features/approvals/server/approval-actions.ts`
- `apps/web/src/features/approvals/components/approval-queue.tsx`
