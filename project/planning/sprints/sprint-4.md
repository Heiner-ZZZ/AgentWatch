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

Base implementada con reglas iniciales; falta endurecimiento y calibracion.
