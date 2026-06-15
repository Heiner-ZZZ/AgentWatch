# Master Traceability Matrix

## Fuente

Fuente principal:

- `Docs/Docs_No_Eliminar/AgentWatch_Latam_requerimientos_v1_0_1_actualizado.md`

Apoyo PDF:

- `Niveles organizacionales`
- `Casos de uso del sistema para AgentWatch Latam`
- `Vision Arquitectonica`
- `Relacion entre registros operativos y reportes gerenciales`

## Objetivo

Tener una sola tabla maestra donde se pueda navegar desde requerimiento, CU o HU hasta feature, backlog item, sprint y estado actual.

## Matriz maestra

| Tipo fuente | ID fuente | Descripcion | Feature relacionada | Backlog item relacionado | Sprint | Estado |
|---|---|---|---|---|---|---|
| RF | RF-01 | Captura de sesion | FEA-11 | BLI-203 | posterior | futuro |
| RF | RF-02 | Explicacion en lenguaje natural | FEA-06 | BLI-006 | 4 | cerrado Sprint 4 |
| RF | RF-03 | Alertas y bloqueos | FEA-07, FEA-08, FEA-10 | BLI-007, BLI-008, BLI-009, BLI-011 | 4-7 | Sprint 4 cerrado en clasificacion base; Sprint 5 cerrado en aprobaciones; notificaciones parciales |
| RF | RF-04 | Reporte exportable | FEA-09 | BLI-010 | 6 | cerrado Sprint 6 |
| RF | RF-05 | Dashboard de control | FEA-04, FEA-05 | BLI-004, BLI-005, BLI-105 | 2, 3 | Sprint 2 cerrado como base operativa; Sprint 3 cerrado con dashboard principal conectado al API |
| RF | RF-06 | Control de permisos | FEA-01, FEA-02, FEA-03 | BLI-002, BLI-003, BLI-102, BLI-106 | 1, 8 | cerrado para Sprint 1 |
| RF | RF-07 | Multi-agente | FEA-03, FEA-05 | por definir | posterior | no iniciado |
| RF | RF-08 | Integraciones nativas Latam | FEA-10 | BLI-011, BLI-012, BLI-201, BLI-202 | 7+ | pendiente |
| RNF | RNF-01 | Rendimiento | FEA-04, FEA-05, FEA-10 | BLI-004, BLI-005, BLI-011, BLI-013 | 2, 3, 7, 8 | Sprint 2 y Sprint 3 cerrados en capa base; resto parcial |
| RNF | RNF-02 | Seguridad y privacidad | FEA-01, FEA-02, FEA-03, FEA-04, FEA-06, FEA-07, FEA-08, FEA-11 | BLI-001, BLI-002, BLI-003, BLI-004, BLI-006, BLI-007, BLI-008, BLI-013, BLI-106, BLI-203 | 1, 2, 4, 5, 8 | Sprint 1, 2, 4 y 5 cerrados en su alcance base |
| RNF | RNF-03 | Disponibilidad | FEA-10, FEA-11 | BLI-011, BLI-013, BLI-201, BLI-203 | 7, 8 | pendiente |
| RNF | RNF-04 | Usabilidad | FEA-01, FEA-05, FEA-06, FEA-09 | BLI-005, BLI-006, BLI-009, BLI-010, BLI-105 | 3, 4, 5, 6 | Sprint 3, 4, 5 y 6 cerrados en su alcance base |
| CU | CU-01 | Administrar organizaciones y membresias | FEA-01, FEA-02 | BLI-001, BLI-002, BLI-101, BLI-106 | 1 | cerrado |
| CU | CU-02 | Registrar agente y credencial | FEA-03 | BLI-003, BLI-102, BLI-106 | 1 | cerrado |
| CU | CU-03 | Enviar evento por API o webhook | FEA-04 | BLI-004, BLI-012, BLI-104 | 2, 7+ | Sprint 2 cerrado para API; webhook provider queda posterior |
| CU | CU-04 | Consultar timeline filtrado | FEA-05 | BLI-005, BLI-105 | 3 | cerrado |
| CU | CU-05 | Interpretar actividad en lenguaje de negocio | FEA-06 | BLI-006 | 4 | cerrado |
| CU | CU-06 | Detectar y clasificar riesgo | FEA-07 | BLI-007 | 4 | cerrado |
| CU | CU-07 | Aprobar o rechazar accion delicada | FEA-08 | BLI-008, BLI-009 | 5 | cerrado |
| CU | CU-08 | Generar y compartir reporte | FEA-09 | BLI-010 | 6 | cerrado |
| CU | CU-09 | Notificar evento critico o pendiente | FEA-10 | BLI-011 | 7 | pendiente |
| HU | HU-01 | Registrar agente | FEA-03 | BLI-003, BLI-102 | 1 | cerrado |
| HU | HU-02 | Enviar evento | FEA-04 | BLI-004 | 2 | cerrado |
| HU | HU-03 | Ver timeline | FEA-05 | BLI-005, BLI-105 | 3 | cerrado |
| HU | HU-04 | Detectar riesgo | FEA-06, FEA-07 | BLI-006, BLI-007 | 4 | cerrado |
| HU | HU-05 | Aprobar accion | FEA-08 | BLI-008, BLI-009 | 5 | cerrado |
| HU | HU-06 | Generar reporte | FEA-09 | BLI-010 | 6 | cerrado |
| HU | HU-07 | Recibir notificacion | FEA-10 | BLI-011 | 7 | pendiente |

## Lectura recomendada

- Si partes de un requisito, busca su fila por `RF` o `RNF`.
- Si partes de una historia o caso de uso, busca `HU` o `CU`.
- Si partes de una implementacion, cruza esta matriz con `features.md`, `backlog-items.md` y `sprints/`.

## Nota metodologica

No todas las relaciones son uno a uno:

- un requisito puede alimentar varias features;
- una feature puede requerir varios backlog items;
- un backlog item puede apoyar mas de una feature;
- un sprint puede ejecutar items de varias fuentes.

Por eso esta matriz se usa como indice central, no como sustituto de las fichas detalladas.
