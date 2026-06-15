# Sprint 2

## Fuente

- `.md 24.4 Sprint 2`
- `.md FEA-04`
- `.md 15 Modelo de Eventos`
- `.md 17.5 Endpoints de eventos`
- apoyo PDF: `Nivel operativo`, `Trazabilidad`

## Objetivo

Recibir, validar, normalizar y almacenar eventos contra PostgreSQL real.

## Features comprometidas

- API de eventos;
- validacion de esquema;
- `idempotency_key`;
- persistencia en `events`;
- eventos atribuibles a organizacion y agente.

## Backlog comprometido

- `BLI-004`

## Relaciones

| Tipo | Relacion |
|---|---|
| Features | `FEA-04` |
| RF | base para `RF-02`, `RF-03`, `RF-05` |
| RNF | `RNF-01`, `RNF-02` |
| CU | `CU-03` |
| HU | `HU-02` |

## Definition of Done

- un agente autenticado puede enviar eventos;
- duplicados se controlan;
- el evento queda persistido;
- el modelo soporta metadata y sensitive flags.

## Estado actual

Cerrado para su alcance MVP.

## Evidencia de cierre

- `POST /api/v1/events` autenticado con API key de agente;
- validacion de payload por DTO;
- verificacion de coincidencia entre `agentId` del payload y la API key;
- normalizacion de `eventType`, `category`, `source` y `sourceApp`;
- persistencia real en PostgreSQL;
- deduplicacion por `organization_id + idempotency_key`;
- metadata y `sensitive_flags` almacenados sin romper el modelo metadata-first;
- prueba e2e dedicada en `apps/api/test/sprint-2.e2e-spec.ts`.

## Deuda posterior que no bloquea el cierre

- `bulk events` como capacidad separada;
- endpoint de webhook provider dedicado;
- procesamiento asincrono con jobs o cola;
- reglas de riesgo y timeline enriquecido como parte de Sprint 3 y 4.
