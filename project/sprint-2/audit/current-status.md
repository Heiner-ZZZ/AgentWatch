# Current Status

## Alcance esperado

Sprint 2 cubre:

- `FEA-04 Ingesta de eventos`
- `BLI-004`

## Lo que esta realmente implementado

- `POST /api/v1/events` protegido por API key de agente;
- validacion de payload con DTO;
- verificacion de que `agentId` coincide con la API key;
- normalizacion de `eventType`, `category`, `source` y `sourceApp`;
- persistencia en PostgreSQL real;
- `idempotency_key` por `organization_id`;
- almacenamiento de metadata y sensitive flags;
- atribucion del evento a organizacion y agente;
- prueba e2e dedicada para ingesta e idempotencia.

## Lo que esta parcial

- no existe aun `bulk events` formal;
- no existe webhook provider dedicado;
- no existe pipeline async o cola de procesamiento.

## Lo que no debe confundirse con Sprint 2

Aunque hoy el flujo de `POST /events` tambien calcula `business_summary` y `risk_level`, eso pertenece al valor agregado de Sprint 4, no al cierre minimo de Sprint 2.

## Juicio actual

Sprint 2 esta `cerrado para su alcance MVP`.

Eso significa:

- la ingesta existe como capacidad real;
- tiene persistencia y deduplicacion;
- y ya puede sostener lo que Sprint 3 y 4 necesitan despues.

## Validacion reciente

- `npm run build -w apps/api`
- `npm run test:e2e -w apps/api`

Ambas validaciones quedaron correctas contra PostgreSQL real usando el test dedicado de Sprint 2.
