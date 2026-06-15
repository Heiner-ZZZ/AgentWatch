# Requirements Matrix

## Fuente

- `5. Requerimientos Funcionales`
- `6. Requerimientos No Funcionales`
- `13.3 MVP incluido`
- `14.1 Features nucleo`
- `24. Sprints de Desarrollo`

Apoyo PDF:

- `Modulos principales del sistema`
- `Catalogo general de casos de uso`
- `Vision Arquitectonica`

## Requisitos funcionales

| Requisito | Feature asociada | Sprint dominante | Estado actual |
|---|---|---|---|
| RF-01 Captura de sesion | FEA-11 | Fuera de core MVP | no iniciado |
| RF-02 Explicacion en lenguaje natural | FEA-06 | Sprint 4 | base implementada |
| RF-03 Sistema de alertas y bloqueos | FEA-07, FEA-08, FEA-10 | Sprint 5-7 | parcial |
| RF-04 Reporte exportable | FEA-09 | Sprint 6 | no iniciado |
| RF-05 Dashboard de control | FEA-05 | Sprint 3 | parcial |
| RF-06 Control de permisos | FEA-02, FEA-03 | Sprint 1+ | parcial conceptual |
| RF-07 Multi-agente | FEA-03, FEA-05 | Fase posterior | no iniciado |
| RF-08 Integraciones nativas Latam | FEA-10 + integraciones | Sprint 7+ | no iniciado |

## Requisitos no funcionales

| Requisito | Area principal | Como se refleja en planning | Estado |
|---|---|---|---|
| RNF-01 Rendimiento | API, timeline, alertas | indices, filtros, consultas, tiempos de carga | parcial |
| RNF-02 Seguridad y privacidad | tenancy, cifrado, evidencia | auth, API keys, aislamiento, opcion manual de evidencia | parcial |
| RNF-03 Disponibilidad | sincronizacion, alertas | separacion app/api/jobs, hardening sprint 8 | pendiente |
| RNF-04 Usabilidad | dashboard, onboarding, idioma | timeline entendible, reportes, UX baseline | parcial |

## Requisitos de arquitectura y gobierno derivados

| Necesidad | Fuente | Respuesta de plan |
|---|---|---|
| Fuente unica de verdad | `1.5`, `16.5` | trazabilidad y eventos como fuente primaria |
| Multi-tenant explicito | `14.1`, `16.2` | organizaciones como tenant root |
| Reportes gerenciales trazables | `11.1`, `16.5` | reportes derivados de `events` |
| Niveles organizacionales | `1.4` + PDF | planeacion separada en estrategico, tactico y operativo |
