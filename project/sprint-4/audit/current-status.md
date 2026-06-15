# Current Status

## Alcance esperado

Sprint 4 cubre:

- `FEA-06 Explicacion en lenguaje natural`
- `FEA-07 Motor de riesgo`
- `BLI-006`
- `BLI-007`

## Lo que esta realmente implementado

- plantillas de resumen para envio, exportacion, sincronizacion, eliminacion, permisos y configuracion;
- fallback tecnico seguro cuando no hay plantilla;
- proteccion contra exposicion de `api_key`, `token`, `secret`, `password` y credenciales en `business_summary`;
- clasificacion `low`, `medium`, `high`, `critical`;
- elevacion de riesgo por acciones destructivas, exportaciones sensibles, cambios de permisos, cambios productivos y señales de secretos;
- persistencia de `risk_level`, `status` y `requires_approval`;
- pruebas unitarias dedicadas para resumen y riesgo;
- prueba e2e dedicada para Sprint 4.

## Lo que esta parcial

- no existe aun configuracion de reglas por organizacion;
- no existe explicacion detallada del por que del riesgo en el payload;
- no hay calibracion estadistica o anomalica.

## Lo que no debe confundirse con Sprint 4

Que un evento quede en `pending_approval` no significa que Sprint 5 ya este implementado. Sprint 4 solo deja preparada y persistida la señal de riesgo y la necesidad de aprobacion.

## Juicio actual

Sprint 4 esta `cerrado para su alcance MVP`.

Eso significa:

- los eventos ya se entienden mejor para negocio;
- el riesgo ya no es implicito sino persistido;
- y la base queda lista para aprobar, notificar y reportar en sprints siguientes.

## Validacion reciente

- `npm run build -w apps/api`
- `npm test -w apps/api -- business-summary.service.spec.ts risk-classification.service.spec.ts`
- `npm run test:e2e -w apps/api`

Las validaciones pasaron contra PostgreSQL real y con evidencia dedicada para Sprint 4.
