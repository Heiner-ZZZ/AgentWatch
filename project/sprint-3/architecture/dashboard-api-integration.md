# Dashboard API Integration

## Objetivo

Documentar el cierre de `BLI-105` como conexion real entre el dashboard web y el API del timeline.

## Flujo implementado

1. La pagina `apps/web/src/app/(app)/dashboard/page.tsx` se renderiza del lado servidor.
2. El frontend crea una sesion tecnica de dashboard contra `POST /api/v1/auth/login`.
3. Con ese token consulta `GET /api/v1/organizations`.
4. Selecciona la primera organizacion accesible como contexto operativo inicial.
5. Consulta `GET /api/v1/events?organizationId=...`.
6. Mapea la respuesta del API a tarjetas de resumen, filtros visibles y tabla timeline.
7. Si no hay datos, el dashboard muestra estado vacio.
8. Si el API falla o no responde, el dashboard muestra estado de error explicito en vez de mocks silenciosos.

## Controles aplicados

- tokens y credenciales quedan del lado servidor;
- el navegador no recibe credenciales del dashboard tecnico;
- la UI usa el contrato real de `organizations` y `events`;
- el dashboard deja de depender de `overview.ts` mockeado.

## Configuracion

- `AGENTWATCH_API_BASE_URL`
- `AGENTWATCH_DASHBOARD_EMAIL`
- `AGENTWATCH_DASHBOARD_PASSWORD`

Si no se definen, el dashboard usa defaults locales para entorno de desarrollo:

- API: `http://localhost:4000/api/v1`
- email: `owner@agentwatch.local`
- password: `demo1234`

## Evidencia tecnica

- `apps/web/src/app/(app)/dashboard/page.tsx`
- `apps/web/src/features/dashboard/server/dashboard-api.ts`
- `apps/web/src/features/dashboard/server/get-dashboard-overview.ts`
- `apps/web/src/features/dashboard/server/dashboard.mapper.ts`
- `apps/web/src/features/dashboard/components/overview-cards.tsx`
- `apps/web/src/features/dashboard/components/recent-events-table.tsx`
