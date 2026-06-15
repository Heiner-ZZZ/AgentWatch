# Sprint 2

Sprint 2 formaliza la ingesta de eventos como flujo propio, separado de timeline, resumen y riesgo.

## Fuente

Fuente principal:

- `Docs/Docs_No_Eliminar/AgentWatch_Latam_requerimientos_v1_0_1_actualizado.md`

Secciones usadas:

- `24.4 Sprint 2`
- `14.1 FEA-04`
- `15. Modelo de Eventos`
- `17.5 Endpoints de eventos`
- `31. HU-02 Enviar evento`

Apoyo estructural del PDF:

- `Nivel operativo`
- `Casos de uso operativos`
- `Relacion entre registros operativos y reportes gerenciales`

## Objetivo

Recibir, validar, normalizar y almacenar eventos contra PostgreSQL real, con atribucion por agente y tenant.

## Estructura

- `architecture/`
- `audit/`
- `delivery/`
- `traceability/`

## Resultado esperado

- un agente autenticado puede emitir eventos;
- el payload se valida;
- el evento queda persistido en `events`;
- `idempotency_key` evita duplicados;
- metadata y sensitive flags quedan almacenados;
- existe evidencia tecnica separada para Sprint 2.

## Lectura recomendada

- `traceability/sprint-2-matrix.md`
- `delivery/backlog-committed.md`
- `audit/current-status.md`
- `architecture/event-ingestion-flow.md`
