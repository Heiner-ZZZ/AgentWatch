# Approvals Flow

## Objetivo

Documentar el flujo implementado de Sprint 5 para control humano sobre eventos sensibles.

## Flujo implementado

1. Un evento entra y Sprint 4 calcula `risk_level`, `status` y `requires_approval`.
2. Si el riesgo es `high` o `critical`, `CreateEventUseCase` solicita a `ApprovalsService` crear una aprobacion.
3. La aprobacion queda ligada a `organization_id` y `event_id`.
4. El API expone `GET /api/v1/approvals` y `GET /api/v1/approvals/:id` para usuarios autenticados del tenant.
5. Solo `owner`, `admin` y `operator` pueden decidir una aprobacion.
6. `POST /api/v1/approvals/:id/decision` registra decision, comentario, usuario y fecha.
7. El evento asociado cambia a `approved` o `rejected`.
8. Auditoria registra `approval.created`, `approval.approved` o `approval.rejected`.
9. La pagina web `/approvals` consume el API real y permite aprobar o rechazar desde server actions.

## Controles activos

- object-level access por tenant;
- decision una sola vez para aprobaciones `pending`;
- trazabilidad de usuario decisor;
- separacion entre auth de dashboard y auth tecnica del agente;
- auditoria de creacion y resolucion.

## Lo que Sprint 5 no promete aun

- SLA de expiracion;
- escalamiento multinivel;
- aprobaciones paralelas;
- notificaciones multicanal por decision.

## Evidencia tecnica

- `apps/api/src/modules/approvals/services/approvals.service.ts`
- `apps/api/src/modules/approvals/controllers/approvals.controller.ts`
- `apps/api/src/infrastructure/database/schema/approvals.schema.ts`
- `apps/api/src/infrastructure/database/repositories/approvals.repository.ts`
- `apps/api/test/sprint-5.e2e-spec.ts`
- `apps/web/src/features/approvals/server/approvals-api.ts`
- `apps/web/src/features/approvals/server/approval-actions.ts`
