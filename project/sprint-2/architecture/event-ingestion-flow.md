# Event Ingestion Flow

## Objetivo

Documentar el flujo real implementado en Sprint 2 para que la trazabilidad no dependa solo de tablas de planning.

## Flujo operativo

1. Un agente registrado rota o recibe una API key activa.
2. El integrador envia `POST /api/v1/events` con `Authorization: Bearer aw_agent_*`.
3. `AgentApiKeyGuard` valida formato, hash y vigencia de la API key.
4. El controlador recibe `CreateEventDto` y aplica validacion estructural del payload.
5. `CreateEventUseCase` verifica que el `agentId` del payload coincide con el `agentId` de la API key.
6. Se consulta el agente para confirmar existencia y pertenencia operativa.
7. Se busca un evento existente por `organization_id + idempotency_key`.
8. Si ya existe, se devuelve el mismo registro y no se duplica escritura.
9. Si no existe, se normalizan `eventType`, `category`, `source` y `sourceApp`.
10. Se persiste el evento en PostgreSQL con `organization_id`, `agent_id`, metadata y `sensitive_flags`.
11. El endpoint responde con el evento persistido y deja base lista para timeline, resumen y riesgo.

## Controles de gobierno y arquitectura ya activos

- aislamiento multi-tenant por `organization_id`;
- idempotencia obligatoria por tenant;
- modelo metadata-first;
- almacenamiento separado de `metadata` y `sensitive_flags`;
- integracion desacoplada de dashboard user auth.

## Lo que Sprint 2 no promete aun

- recepcion por webhook provider versionado;
- ingestiones masivas;
- cola asincrona;
- aprobaciones automáticas;
- notificaciones o reportes.

## Evidencia tecnica

- `apps/api/src/common/auth/guards/agent-api-key.guard.ts`
- `apps/api/src/modules/events/controllers/events.controller.ts`
- `apps/api/src/modules/events/dto/create-event.dto.ts`
- `apps/api/src/modules/events/use-cases/create-event.use-case.ts`
- `apps/api/src/infrastructure/database/repositories/events.repository.ts`
- `scripts/db/v1/003_agentwatch_sprint2_events.sql`
- `apps/api/test/sprint-2.e2e-spec.ts`
