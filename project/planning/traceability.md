# Traceability

Ver tambien:

- `project/planning/master-traceability-matrix.md`

## Regla

Ningun sprint ni backlog item debe existir sin fuente documental.

## Matriz fuente -> ejecucion

| Fuente | Elemento fuente | Se traduce en | Sprint | Estado actual |
|---|---|---|---|---|
| `.md 24.3` | Auth, organizaciones y agentes | FEA-01, FEA-02, FEA-03 | 1 | base implementada |
| `.md 24.4` | API de eventos | FEA-04 | 2 | implementada |
| `.md 24.5` | Timeline del dashboard | FEA-05, HU-03 | 3 | parcial |
| `.md 24.6` | Explicacion y riesgo | FEA-06, FEA-07, HU-04 | 4 | base implementada |
| `.md 24.7` | Aprobaciones humanas | FEA-08, HU-05 | 5 | pendiente |
| `.md 24.8` | Reportes PDF | FEA-09, HU-06 | 6 | pendiente |
| `.md 24.9` | Notificaciones e integracion n8n | FEA-10, HU-07 | 7 | pendiente |
| `.md 24.10` | Hardening y beta | readiness, seguridad, observabilidad | 8 | pendiente |
| `.md 5 RF-02` | Explicacion en lenguaje natural | business summary | 4 | base implementada |
| `.md 5 RF-03` | Alertas y bloqueos | riesgo + aprobaciones + notificaciones | 5-7 | parcial |
| `.md 6 RNF-02` | Seguridad y privacidad | tenancy, API keys, opcion manual de evidencia | 1-8 | parcial |
| `PDF Vision Arquitectonica` | relacion operacion -> gerencia | `16.5` + reportes trazables | 6 | pendiente |
| `PDF Casos de uso del sistema` | CU estrategicos/tacticos/operativos | `use-cases-and-stories.md` | transversal | consolidado |

## Nota sobre el PDF

El PDF se usa aqui como fuente estructural complementaria.

Debido a que en este entorno no se pudo extraer el cuerpo completo automaticamente, la trazabilidad hacia el PDF se referencia por titulos de seccion visibles en su indice interno, no por citas textuales extensas.
