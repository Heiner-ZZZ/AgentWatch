# Master Plan

## Fuente

Fuente principal:

- `Docs/Docs_No_Eliminar/AgentWatch_Latam_requerimientos_v1_0_1_actualizado.md`

Secciones del `.md` usadas:

- `1. Vision del Producto`
- `5. Requerimientos Funcionales`
- `6. Requerimientos No Funcionales`
- `13. Alcance del MVP v1.1`
- `14. Mapa de Features del Producto`
- `15. Modelo de Eventos`
- `16. Modelo de Base de Datos`
- `17. APIs del MVP`
- `24. Sprints de Desarrollo`
- `31. Historias de Usuario`

Apoyo estructural del PDF:

- `Casos de uso del sistema para AgentWatch Latam`
- `Vision Arquitectonica`
- `Niveles organizacionales`
- `Relacion entre registros operativos y reportes gerenciales`

## Objetivo del plan

Bajar el producto a una estructura ejecutable y verificable sin romper coherencia con requerimientos, CU, HU, RF, RNF y arquitectura.

## Capas del producto

### Capa estrategica

- posicionamiento en Latam y Espana;
- confianza y trazabilidad en espanol;
- reportes y evidencia para negocio, cliente, auditor o regulador.

### Capa tactica

- timeline entendible;
- gestion de agentes;
- reglas de riesgo;
- aprobaciones;
- reportes;
- notificaciones.

### Capa operativa

- auth y sesiones;
- organizaciones y usuarios;
- API keys;
- ingesta de eventos;
- persistencia PostgreSQL;
- clasificacion de riesgo;
- generacion de `business_summary`.

## Features formales del MVP

| ID | Feature | Fuente | Resultado esperado |
|---|---|---|---|
| FEA-01 | Gestion de organizaciones | `14.1`, `17.3` | tenant y configuracion base |
| FEA-02 | Gestion de usuarios y roles | `14.1`, `16.2` | control de acceso minimo |
| FEA-03 | Gestion de agentes | `14.1`, `17.4` | registro y API key por agente |
| FEA-04 | Ingesta de eventos | `14.1`, `17.5` | recepcion, validacion e idempotencia |
| FEA-05 | Timeline de actividad | `14.1`, `24.5` | lectura cronologica y filtros |
| FEA-06 | Explicacion en lenguaje natural | `14.1`, `24.6` | resumen en espanol |
| FEA-07 | Motor de riesgo | `14.1`, `15.5`, `24.6` | `risk_level` y reglas base |
| FEA-08 | Aprobaciones humanas | `14.1`, `24.7` | aprobar o rechazar eventos delicados |
| FEA-09 | Reportes PDF | `14.1`, `24.8` | reporte exportable por periodo |
| FEA-10 | Notificaciones | `14.1`, `24.9` | alertas por email y luego WhatsApp |
| FEA-11 | Evidencia visual opcional | `14.1`, `12.1` | capacidad manual y no core |

Detalle formal:

- `project/planning/features.md`

## Artefactos formales del proyecto

Ademas de features y sprints, AgentWatch debe sostener:

- RF y RNF;
- CU y HU;
- modelo de eventos;
- modelo de datos;
- backlog priorizado;
- backlog itemizado;
- trazabilidad fuente -> implementacion;
- evidencia de estado por sprint.

## Secuencia de entrega recomendada

| Sprint | Enfoque | Features principales |
|---|---|---|
| Sprint 0 | Fundaciones | base arquitectonica, backlog, entorno, UI baseline |
| Sprint 1 | Identidad y tenancy | FEA-01, FEA-02, FEA-03 |
| Sprint 2 | Ingesta | FEA-04 |
| Sprint 3 | Lectura operativa | FEA-05 |
| Sprint 4 | Comprension y riesgo | FEA-06, FEA-07 |
| Sprint 5 | Control humano | FEA-08 |
| Sprint 6 | Evidencia ejecutiva | FEA-09 |
| Sprint 7 | Reaccion e integraciones | FEA-10 + n8n |
| Sprint 8 | Hardening | endurecimiento, demo beta y readiness comercial |

## Definition of Done global

Un bloque del producto se considera implementado de verdad cuando:

- existe soporte en base de datos y API si aplica;
- existe criterio de aceptacion verificable;
- existe evidencia funcional o de test;
- respeta tenancy y auth;
- tiene trazabilidad a fuente documental;
- no depende de mock si se declara como backend o flujo real.
