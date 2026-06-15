# Current Status

## Alcance esperado

Sprint 6 cubre:

- `FEA-09 Reportes PDF`
- `BLI-010`

## Lo que esta realmente implementado

- tabla `reports` persistida en PostgreSQL;
- generacion de reporte por rango de fechas;
- resumen ejecutivo con conteos de eventos, riesgos y aprobaciones;
- anexo tecnico compacto dentro del payload y del PDF;
- descarga de PDF desde endpoint protegido;
- auditoria `report.generated`;
- vista `/reports` conectada al API real con generacion y descarga.

## Lo que esta parcial

- el PDF es simple y de una sola plantilla;
- no hay programacion automatica de reportes;
- no existe firma digital ni control de expiracion de descarga.

## Lo que no debe confundirse con Sprint 6

Que el reporte ya exista no significa que el sistema tenga BI completo, tableros historicos avanzados o compliance documental final.

## Juicio actual

Sprint 6 queda `cerrado para su alcance MVP`.

Eso significa:

- el tenant ya puede convertir operaciones reales en evidencia exportable;
- el owner o auditor ya puede descargar un PDF defendible;
- y el reporte mantiene hilo de trazabilidad con eventos, aprobaciones y auditoria.
