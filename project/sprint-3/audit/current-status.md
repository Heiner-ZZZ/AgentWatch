# Current Status

## Alcance esperado

Sprint 3 cubre:

- `FEA-05 Timeline de actividad`
- `BLI-005`
- `BLI-105`

## Lo que esta realmente implementado

- `GET /api/v1/events` protegido con sesion de usuario;
- `GET /api/v1/events/:id` protegido con sesion de usuario;
- filtros por `organizationId`, `agentId`, `eventType`, `riskLevel`, `status`, `dateFrom` y `dateTo`;
- orden cronologico descendente por `occurred_at` y `received_at`;
- detalle con `businessSummary`, `technicalSummary`, metadata y sensitive flags;
- aislamiento multi-tenant via membresias del usuario;
- test e2e dedicado para timeline, filtros y bloqueo entre organizaciones;
- dashboard principal web conectado al API real mediante fetch server-side;
- estados vacio y error en la pantalla en vez de mocks fijos.

## Lo que esta parcial

- no existe paginacion formal en el endpoint;
- no hay busqueda full-text ni agregaciones historicas;
- otras vistas del producto aun no consumen API real con el mismo nivel de cierre.

## Lo que no debe confundirse con Sprint 3

Aunque el timeline ya muestra `businessSummary`, `riskLevel` y `status`, esos valores hoy son enriquecidos por la capa que tambien sirve a Sprint 4. Sprint 3 consume ese resultado, pero su cierre se centra en consulta, filtrado, detalle y aislamiento.

## Juicio actual

Sprint 3 esta `cerrado para su alcance MVP`.

Eso significa:

- el flujo tactico principal existe en la API;
- la lectura por tenant es segura;
- y el dashboard principal ya consume datos reales sin depender de mocks locales.

## Validacion reciente

- `npm run build -w apps/api`
- `npm run test:e2e -w apps/api`
- `npm run build -w apps/web`

Las validaciones pasaron, incluyendo el build del frontend conectado al API real.
