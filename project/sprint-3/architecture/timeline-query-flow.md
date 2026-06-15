# Timeline Query Flow

## Objetivo

Documentar el flujo real implementado en Sprint 3 para consulta de timeline y detalle por tenant.

## Flujo operativo

1. Un usuario del dashboard inicia sesion y recibe token de sesion.
2. El usuario consulta `GET /api/v1/events` o `GET /api/v1/events/:id`.
3. `SessionAuthGuard` valida autenticacion de sesion.
4. `EventsService` resuelve las organizaciones accesibles desde `organization_users`.
5. Si se solicita `organizationId`, solo se permite si pertenece a las membresias del usuario.
6. `EventsRepository` ejecuta consulta filtrada por tenant y filtros opcionales.
7. Los resultados se ordenan por `occurred_at DESC, received_at DESC`.
8. El mapper expone `displaySummary`, `riskLevel`, `status`, metadata y detalle tecnico.
9. Si el evento solicitado no pertenece a una organizacion accesible, el endpoint responde `404`.

## Controles de gobierno y arquitectura ya activos

- aislamiento multi-tenant por membresias;
- filtros validados por DTO;
- misma entidad `events` como fuente autoritativa;
- salida apta para UI tactica sin exponer secretos ni credenciales;
- separacion entre autenticacion de dashboard y autenticacion tecnica de agente.

## Lo que Sprint 3 no promete aun

- dashboard web conectado a API real;
- paginacion y cursores formales;
- busqueda textual;
- comparativas por agente o analytics historicos.

## Evidencia tecnica

- `apps/api/src/modules/events/controllers/events.controller.ts`
- `apps/api/src/modules/events/services/events.service.ts`
- `apps/api/src/modules/events/dto/list-events-query.dto.ts`
- `apps/api/src/modules/events/use-cases/create-event.use-case.ts`
- `apps/api/src/infrastructure/database/repositories/events.repository.ts`
- `apps/api/test/sprint-3.e2e-spec.ts`
