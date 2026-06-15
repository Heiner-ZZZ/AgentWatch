# Sprint 6

## Fuente

- `.md 24.8 Sprint 6`
- `.md FEA-09`
- `.md HU-06`
- apoyo PDF: `Relacion entre registros operativos y reportes gerenciales`

## Objetivo

Generar reporte PDF simple y trazable desde los eventos operativos.

## Features comprometidas

- seleccionar periodo;
- resumir actividad;
- incluir riesgos, errores y aprobaciones;
- exportar PDF.

## Backlog comprometido

- `BLI-010`

## Relaciones

| Tipo | Relacion |
|---|---|
| Features | `FEA-09` |
| RF | `RF-04` |
| RNF | `RNF-04` |
| CU | `CU-08` |
| HU | `HU-06` |

## Definition of Done

- el reporte se genera para un rango de fechas;
- usa eventos reales como fuente;
- presenta resumen ejecutivo y anexo tecnico;
- queda persistido en `reports`;
- puede descargarse desde la web conectada al API real.

## Estado actual

Cerrado para alcance MVP.

## Evidencia de cierre

- `apps/api/test/sprint-6.e2e-spec.ts`
- `apps/api/src/modules/reports/services/reports.service.ts`
- `apps/api/src/infrastructure/database/schema/reports.schema.ts`
- `apps/web/src/features/reports/components/report-catalog.tsx`
- `project/sprint-6/traceability/sprint-6-matrix.md`
