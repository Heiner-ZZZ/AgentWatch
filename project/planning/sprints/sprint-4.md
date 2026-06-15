# Sprint 4

## Fuente

- `.md 24.6 Sprint 4`
- `.md FEA-06`
- `.md FEA-07`
- `.md HU-04`
- apoyo PDF: `Resumen en lenguaje de negocio`, `Prediccion de riesgo operativo`

## Objetivo

Convertir eventos tecnicos en explicaciones utiles y clasificarlos por riesgo.

## Features comprometidas

- plantillas de resumen;
- `business_summary`;
- reglas basicas de riesgo;
- niveles `low/medium/high/critical`.

## Backlog comprometido

- `BLI-006`
- `BLI-007`

## Relaciones

| Tipo | Relacion |
|---|---|
| Features | `FEA-06`, `FEA-07` |
| RF | `RF-02`, `RF-03` |
| RNF | `RNF-02`, `RNF-04` |
| CU | `CU-05`, `CU-06` |
| HU | `HU-04` |

## Definition of Done

- un evento tecnico se entiende en lenguaje de negocio;
- eventos masivos o destructivos se marcan con nivel alto o critico;
- la clasificacion queda persistida.

## Estado actual

Cerrado para su alcance MVP.

## Evidencia de cierre

- `business_summary` generado con plantillas utiles para negocio;
- fallback seguro cuando el detalle tecnico contiene secretos o credenciales;
- riesgo `low`, `medium`, `high`, `critical` persistido;
- elevacion de riesgo por acciones destructivas, permisos, configuracion productiva y exportaciones sensibles;
- pruebas unitarias dedicadas para resumen y riesgo;
- prueba e2e dedicada en `apps/api/test/sprint-4.e2e-spec.ts`.

## Deuda posterior que no bloquea el cierre

- reglas configurables por tenant;
- explicacion estructurada del motivo de riesgo;
- calibracion historica y anomalias.
