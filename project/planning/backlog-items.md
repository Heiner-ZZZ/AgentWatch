# Backlog Items

## Fuente

Fuente principal:

- `project/planning/backlog.md`
- `project/planning/features.md`
- `24. Sprints de Desarrollo`

Apoyo PDF:

- `Casos de uso del sistema para AgentWatch Latam`
- `Vision Arquitectonica`

## Formato

Cada backlog item se documenta con:

- objetivo;
- tipo;
- fuente;
- dependencias;
- definition of done;
- evidencia esperada;
- estado real.

## BLI-001 Login y sesion de usuario

**Tipo:** backend/security

**Fuente:** `17.2`, `24.3`

**Relacion**

- Feature relacionada: `FEA-02`
- RF/RNF relacionadas: `RNF-02`
- CU/HU relacionadas: soporte transversal a `CU-01`, `HU-01`
- Sprint objetivo: `Sprint 1`

**Objetivo**

Dar acceso autenticado al dashboard.

**Dependencias**

- usuarios;
- sesiones.

**Definition of Done**

- login funcional;
- sesion persistida;
- guard usable en rutas protegidas.

**Evidencia esperada**

- endpoint funcional;
- test e2e o equivalente.

**Estado**

Cerrado para Sprint 1.

## BLI-002 Organizaciones y membresias

**Tipo:** backend/data

**Fuente:** `17.3`, `24.3`

**Relacion**

- Feature relacionada: `FEA-01`
- RF/RNF relacionadas: `RF-06`, `RNF-02`
- CU/HU relacionadas: `CU-01`
- Sprint objetivo: `Sprint 1`

**Objetivo**

Crear tenant y vincular owner inicial.

**Dependencias**

- auth;
- users.

**Definition of Done**

- se crea organizacion;
- se crea membresia owner;
- el tenant queda disponible para agentes y eventos.

**Evidencia esperada**

- tabla y endpoint;
- persistencia real.

**Estado**

Cerrado para Sprint 1.

## BLI-003 Registro de agentes y rotate key

**Tipo:** backend/security

**Fuente:** `17.4`, `24.3`

**Relacion**

- Feature relacionada: `FEA-03`
- RF/RNF relacionadas: `RF-06`, `RNF-02`
- CU/HU relacionadas: `CU-02`, `HU-01`
- Sprint objetivo: `Sprint 1`

**Objetivo**

Habilitar identidad tecnica del agente.

**Dependencias**

- organizaciones;
- auth dashboard.

**Definition of Done**

- crear agente;
- emitir API key;
- rotarla;
- mantener asociacion por organizacion.

**Evidencia esperada**

- endpoint funcional;
- key retornada y usable.

**Estado**

Cerrado para Sprint 1.

## BLI-004 Ingesta de eventos con idempotencia

**Tipo:** backend/data

**Fuente:** `17.5`, `24.4`

**Relacion**

- Feature relacionada: `FEA-04`
- RF/RNF relacionadas: `RF-05`, `RNF-01`, `RNF-02`
- CU/HU relacionadas: `CU-03`, `HU-02`
- Sprint objetivo: `Sprint 2`

**Objetivo**

Recibir actividad real sin duplicados.

**Dependencias**

- agentes;
- API key;
- tabla `events`.

**Definition of Done**

- payload validado;
- `idempotency_key` respetada;
- evento persistido;
- metadata almacenada.

**Evidencia esperada**

- endpoint funcional;
- test e2e con duplicado.

**Estado**

Cerrado para Sprint 2.

## BLI-005 Timeline filtrable por tenant

**Tipo:** backend/frontend

**Fuente:** `24.5`, `HU-03`

**Relacion**

- Feature relacionada: `FEA-05`
- RF/RNF relacionadas: `RF-05`, `RNF-01`, `RNF-04`
- CU/HU relacionadas: `CU-04`, `HU-03`
- Sprint objetivo: `Sprint 3`

**Objetivo**

Mostrar historial operable para usuario de negocio.

**Dependencias**

- eventos persistidos;
- auth de usuario;
- membresias.

**Definition of Done**

- listado cronologico;
- filtros;
- detalle;
- aislamiento por organizacion.

**Evidencia esperada**

- endpoints `GET /events` y `GET /events/:id`;
- UI conectada o lista para conexion real.

**Estado**

Cerrado para Sprint 3 backend/API.

## BLI-006 Resumen en espanol por plantilla

**Tipo:** backend/product

**Fuente:** `24.6`, `FEA-06`

**Relacion**

- Feature relacionada: `FEA-06`
- RF/RNF relacionadas: `RF-02`, `RNF-04`
- CU/HU relacionadas: `CU-05`, `HU-04`
- Sprint objetivo: `Sprint 4`

**Objetivo**

Hacer entendible el evento tecnico.

**Dependencias**

- taxonomia de eventos;
- metadata consistente.

**Definition of Done**

- genera `business_summary`;
- cubre tipos base de evento;
- deja fallback razonable.

**Evidencia esperada**

- servicio de plantillas;
- persistencia del resumen.

**Estado**

Cerrado para Sprint 4.

## BLI-007 Riesgo low medium high critical

**Tipo:** backend/product

**Fuente:** `15.5`, `24.6`

**Relacion**

- Feature relacionada: `FEA-07`
- RF/RNF relacionadas: `RF-03`, `RNF-02`
- CU/HU relacionadas: `CU-06`, `HU-04`
- Sprint objetivo: `Sprint 4`

**Objetivo**

Marcar impacto operativo y preparar aprobaciones.

**Dependencias**

- metadata del evento;
- tipos de evento;
- summary opcional.

**Definition of Done**

- clasifica por reglas;
- persiste `risk_level`;
- define `requires_approval`.

**Evidencia esperada**

- clasificador funcional;
- test con casos masivos o destructivos.

**Estado**

Cerrado para Sprint 4.

## BLI-008 Crear aprobacion al detectar riesgo alto

**Tipo:** backend/product

**Fuente:** `24.7`, `HU-05`

**Relacion**

- Features relacionadas: `FEA-07`, `FEA-08`
- RF/RNF relacionadas: `RF-03`, `RNF-02`
- CU/HU relacionadas: `CU-07`, `HU-05`
- Sprint objetivo: `Sprint 5`

**Objetivo**

Crear control humano formal sobre eventos sensibles.

**Dependencias**

- riesgo implementado;
- roles;
- tabla `approvals`.

**Definition of Done**

- evento alto/critico crea aprobacion;
- la aprobacion queda asociada al evento;
- se puede consultar.

**Evidencia esperada**

- entidad y endpoint;
- trazabilidad con `event_id`.

**Estado**

Cerrado para Sprint 5.

## BLI-009 Vista de aprobaciones pendientes

**Tipo:** frontend/backend

**Fuente:** `24.7`

**Relacion**

- Feature relacionada: `FEA-08`
- RF/RNF relacionadas: `RF-03`, `RNF-04`
- CU/HU relacionadas: `CU-07`, `HU-05`
- Sprint objetivo: `Sprint 5`

**Objetivo**

Dar superficie de decision a operator o admin.

**Dependencias**

- aprobaciones creadas;
- auth y roles.

**Definition of Done**

- lista pendientes;
- detalle;
- accion aprobar/rechazar.

**Evidencia esperada**

- endpoint y pantalla funcional.

**Estado**

Cerrado para Sprint 5.

## BLI-010 Generar reporte PDF semanal

**Tipo:** backend/reporting

**Fuente:** `24.8`, `HU-06`

**Relacion**

- Feature relacionada: `FEA-09`
- RF/RNF relacionadas: `RF-04`, `RNF-04`
- CU/HU relacionadas: `CU-08`, `HU-06`
- Sprint objetivo: `Sprint 6`

**Objetivo**

Transformar eventos y decisiones en evidencia ejecutiva exportable.

**Dependencias**

- timeline;
- summaries;
- riesgo;
- aprobaciones.

**Definition of Done**

- recibe rango;
- genera PDF;
- incluye resumen, riesgos y errores;
- persiste registro en `reports`;
- puede descargarse por usuario autenticado del tenant.

**Evidencia esperada**

- archivo generado;
- registro en `reports`.

**Estado**

Cerrado para Sprint 6.

## BLI-011 Registrar notificaciones email

**Tipo:** backend/integration

**Fuente:** `24.9`, `HU-07`

**Relacion**

- Feature relacionada: `FEA-10`
- RF/RNF relacionadas: `RF-03`, `RF-08`, `RNF-03`
- CU/HU relacionadas: `CU-09`, `HU-07`
- Sprint objetivo: `Sprint 7`

**Objetivo**

Alertar al usuario sin depender aun de canales complejos.

**Dependencias**

- eventos criticos;
- aprobaciones;
- destinatario.

**Definition of Done**

- trigger por evento;
- registro de intento;
- estado enviado o fallido.

**Evidencia esperada**

- entidad `notifications`;
- provider email o stub controlado.

**Estado**

Pendiente.

## BLI-012 Guia o plantilla n8n

**Tipo:** docs/integration

**Fuente:** `24.9`

**Relacion**

- Feature relacionada: `FEA-10`
- RF/RNF relacionadas: `RF-08`
- CU/HU relacionadas: soporte a `CU-03`, `HU-02`
- Sprint objetivo: `Sprint 7`

**Objetivo**

Reducir friccion de adopcion para integradores.

**Dependencias**

- API de eventos estable;
- payload claro.

**Definition of Done**

- existe guia paso a paso;
- existe payload ejemplo;
- existe forma de probar envio.

**Evidencia esperada**

- documento o plantilla JSON.

**Estado**

Pendiente.

## BLI-013 Hardening tenancy audit y readiness

**Tipo:** cross-cutting

**Fuente:** `24.10`

**Relacion**

- Features relacionadas: `FEA-01` a `FEA-10`
- RF/RNF relacionadas: `RNF-01`, `RNF-02`, `RNF-03`, `RNF-04`
- CU/HU relacionadas: soporte transversal
- Sprint objetivo: `Sprint 8`

**Objetivo**

Cerrar brechas que separan una base funcional de una beta defendible.

**Dependencias**

- sprints 1 a 7;
- matriz de riesgos abierta.

**Definition of Done**

- tenancy revisado;
- auth revisada;
- auditoria minima;
- performance aceptable;
- demo beta sin flujos rotos.

**Evidencia esperada**

- checklist cumplido;
- pruebas y/o review tecnica.

**Estado**

Pendiente.

## BLI-101 Logout y refresh reales

**Tipo:** security

**Fuente:** `17.2`

**Relacion**

- Feature relacionada: `FEA-02`
- RF/RNF relacionadas: `RNF-02`
- Sprint objetivo: `Sprint 8`

**Objetivo**

Cerrar ciclo de sesion del dashboard.

**Estado**

Base implementada.

## BLI-102 RBAC mas fino por rol

**Tipo:** security

**Fuente:** `FEA-02`, `RF-06`

**Relacion**

- Feature relacionada: `FEA-02`
- RF/RNF relacionadas: `RF-06`, `RNF-02`
- Sprint objetivo: `Sprint 8`

**Objetivo**

Pasar de guardas basicas a permisos por accion y objeto.

**Estado**

Cerrado para Sprint 1 con RBAC minimo por rol y objeto.

## BLI-103 Bulk events

**Tipo:** backend

**Fuente:** `17.5`

**Relacion**

- Feature relacionada: `FEA-04`
- RF/RNF relacionadas: `RNF-01`
- Sprint objetivo: fase posterior o Sprint 8 extendido

**Objetivo**

Aceptar lotes de eventos para integraciones con mayor volumen.

**Estado**

Pendiente.

## BLI-104 Webhook provider endpoint

**Tipo:** integration

**Fuente:** `17.10`

**Relacion**

- Feature relacionada: `FEA-04`
- RF/RNF relacionadas: `RF-08`, `RNF-03`
- Sprint objetivo: fase posterior

**Objetivo**

Recibir eventos desde proveedores con contrato dedicado.

**Estado**

Pendiente.

## BLI-105 Dashboard conectado a API real

**Tipo:** frontend

**Fuente:** `RF-05`, `HU-03`

**Relacion**

- Feature relacionada: `FEA-05`
- RF/RNF relacionadas: `RF-05`, `RNF-04`
- CU/HU relacionadas: `CU-04`, `HU-03`
- Sprint objetivo: Sprint 3 extendido o Sprint 8

**Objetivo**

Eliminar mocks del dashboard principal.

**Definition of Done**

- el dashboard consulta `organizations` y `events` del API real;
- deja de depender de dataset mock local;
- muestra estados vacio y error;
- preserva el contexto de tenant visible en la pantalla.

**Evidencia esperada**

- pagina dashboard server-side conectada al API;
- capa de mapper o contrato para `events`;
- build de `apps/web` correcto.

**Estado**

Cerrado para Sprint 3 extendido.

## BLI-106 Auditoria de acciones criticas

**Tipo:** security/data

**Fuente:** `16.2`, `RF-06`

**Relacion**

- Feature relacionada: `FEA-02`
- RF/RNF relacionadas: `RF-06`, `RNF-02`
- CU/HU relacionadas: soporte a `CU-07`, `CU-08`
- Sprint objetivo: `Sprint 8`

**Objetivo**

Registrar cambios delicados para investigacion y cumplimiento.

**Estado**

Cerrado para Sprint 1.
