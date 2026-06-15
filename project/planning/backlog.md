# Backlog

## Fuente

- `13.3 MVP incluido`
- `14.1 Features nucleo`
- `17. APIs del MVP`
- `24. Sprints de Desarrollo`
- `31. Historias de Usuario`

Apoyo PDF:

- `Catalogo general de casos de uso`
- `Vision Arquitectonica`
- `Relacion entre registros operativos y reportes gerenciales`

Detalle formal por item:

- `project/planning/backlog-items.md`

## P0 Comprometido para MVP

| ID | Item | Tipo | Fuente | Sprint | Estado |
|---|---|---|---|---|---|
| BLI-001 | Login y sesion de usuario | backend/security | `17.2`, `24.3` | 1 | base implementada |
| BLI-002 | Organizaciones y membresias | backend/data | `17.3`, `24.3` | 1 | base implementada |
| BLI-003 | Registro de agentes y rotate key | backend/security | `17.4`, `24.3` | 1 | base implementada |
| BLI-004 | Ingesta de eventos con idempotencia | backend/data | `17.5`, `24.4` | 2 | cerrado Sprint 2 |
| BLI-005 | Timeline filtrable por tenant | backend/frontend | `24.5`, `HU-03` | 3 | cerrado Sprint 3 |
| BLI-006 | Resumen en espanol por plantilla | backend/product | `24.6`, `FEA-06` | 4 | cerrado Sprint 4 |
| BLI-007 | Riesgo `low/medium/high/critical` | backend/product | `15.5`, `24.6` | 4 | cerrado Sprint 4 |
| BLI-008 | Crear aprobacion al detectar riesgo alto | backend/product | `24.7`, `HU-05` | 5 | cerrado Sprint 5 |
| BLI-009 | Vista de aprobaciones pendientes | frontend/backend | `24.7` | 5 | cerrado Sprint 5 |
| BLI-010 | Generar reporte PDF semanal | backend/reporting | `24.8`, `HU-06` | 6 | cerrado Sprint 6 |
| BLI-011 | Registrar notificaciones email | backend/integration | `24.9`, `HU-07` | 7 | pendiente |
| BLI-012 | Guia o plantilla n8n | docs/integration | `24.9` | 7 | pendiente |
| BLI-013 | Hardening tenancy, audit y readiness | cross-cutting | `24.10` | 8 | pendiente |

## P1 Necesario pero no bloqueante para MVP demo

| ID | Item | Tipo | Fuente | Estado |
|---|---|---|---|---|
| BLI-101 | Logout y refresh reales | security | `17.2` | pendiente |
| BLI-102 | RBAC mas fino por rol | security | `FEA-02`, `RF-06` | pendiente |
| BLI-103 | Bulk events | backend | `17.5` | pendiente |
| BLI-104 | Webhook provider endpoint | integration | `17.10` | pendiente |
| BLI-105 | Dashboard conectado a API real | frontend | `RF-05`, `HU-03` | cerrado Sprint 3 extendido |
| BLI-106 | Auditoria de acciones criticas | security/data | `16.2`, `RF-06` | pendiente |

## P2 Evolucion

| ID | Item | Tipo | Fuente | Estado |
|---|---|---|---|---|
| BLI-201 | WhatsApp Business | integration | `FEA-10`, `RF-08` | futuro |
| BLI-202 | Integraciones contables locales | integration | `RF-08` | futuro |
| BLI-203 | Evidencia visual manual | product/security | `FEA-11` | futuro |
| BLI-204 | Deteccion de anomalias | analytics | `16.6` | futuro |
| BLI-205 | Self-hosted base | architecture | `RNF-02`, `Roadmap` | futuro |
