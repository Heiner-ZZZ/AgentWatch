# Sprint 3

## Fuente

- `.md 24.5 Sprint 3`
- `.md FEA-05`
- `.md HU-03`
- apoyo PDF: `Casos de uso tacticos`

## Objetivo

Mostrar eventos en una vista entendible para operacion y revision.

## Features comprometidas

- lista cronologica;
- filtros por agente, fecha, riesgo y tipo;
- detalle de evento;
- riesgo visible;
- estado visible.

## Backlog comprometido

- `BLI-005`
- `BLI-105`

## Relaciones

| Tipo | Relacion |
|---|---|
| Features | `FEA-05` |
| RF | `RF-05` |
| RNF | `RNF-01`, `RNF-04` |
| CU | `CU-04` |
| HU | `HU-03` |

## Definition of Done

- el usuario puede consultar timeline de su organizacion;
- puede filtrar;
- puede abrir detalle;
- no ve eventos de otras organizaciones.

## Estado actual

Cerrado para su alcance MVP.

## Evidencia de cierre

- `GET /api/v1/events` funcional con filtros por tenant;
- `GET /api/v1/events/:id` funcional con detalle por evento;
- orden cronologico util para operacion;
- `displaySummary`, `riskLevel` y `status` visibles en la respuesta;
- aislamiento multi-tenant probado con usuario sin acceso a otra organizacion;
- prueba e2e dedicada en `apps/api/test/sprint-3.e2e-spec.ts`;
- dashboard principal conectado al API real mediante render server-side y mapper dedicado.

## Deuda posterior que no bloquea el cierre

- paginacion formal;
- analytics o agregaciones superiores.
