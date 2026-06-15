# Use Cases And Stories

## Fuente

Fuente principal:

- `14.2 Agrupacion de casos de uso por nivel organizacional`
- `31. Historias de Usuario`

Apoyo PDF:

- `Casos de uso del sistema para AgentWatch Latam`
- `Casos de uso estrategicos`
- `Casos de uso tacticos`
- `Casos de uso operativos`

## Actores

| Actor | Nivel | Rol dentro del sistema |
|---|---|---|
| Owner | Estrategico | decide, revisa riesgo, ve reportes |
| Admin | Tactico | configura agentes, reglas e integraciones |
| Operator | Tactico | monitorea timeline y decide aprobaciones |
| Auditor | Estrategico/Tactico | consulta historial y exporta evidencia |
| Integrator | Tactico/Operativo | registra agentes, integra flujos y demuestra valor al cliente |
| Agente / Workflow / Webhook | Operativo | emite eventos y dispara actividad |

## Casos de uso formales

| ID | Caso de uso | Nivel | Resultado |
|---|---|---|---|
| CU-01 | Administrar organizaciones y membresias | Tactico | tenant listo para operar |
| CU-02 | Registrar agente y credencial | Operativo | agente listo para emitir eventos |
| CU-03 | Enviar evento por API o webhook | Operativo | actividad registrada con idempotencia |
| CU-04 | Consultar timeline filtrado | Tactico | lectura clara por fecha, riesgo y agente |
| CU-05 | Interpretar actividad en lenguaje de negocio | Tactico/Estrategico | explicacion util para no tecnicos |
| CU-06 | Detectar y clasificar riesgo | Tactico | evento marcado con prioridad |
| CU-07 | Aprobar o rechazar accion delicada | Tactico | decision humana auditable |
| CU-08 | Generar y compartir reporte | Estrategico | evidencia exportable |
| CU-09 | Notificar evento critico o pendiente | Tactico/Estrategico | reaccion oportuna |

## Historias de usuario del `.md`

| HU | Relacion con CU | Estado esperado |
|---|---|---|
| HU-01 Registrar agente | CU-02 | Sprint 1 |
| HU-02 Enviar evento | CU-03 | Sprint 2 |
| HU-03 Ver timeline | CU-04 | Sprint 3 |
| HU-04 Detectar riesgo | CU-05, CU-06 | Sprint 4 |
| HU-05 Aprobar accion | CU-07 | Sprint 5 |
| HU-06 Generar reporte | CU-08 | Sprint 6 |
| HU-07 Recibir notificacion | CU-09 | Sprint 7 |

## Criterio editorial

Los CU se usan como marco mas formal y transversal.

Las HU se usan como expresion incremental orientada a valor por sprint.
