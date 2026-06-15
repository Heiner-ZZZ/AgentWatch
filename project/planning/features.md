# Features

## Fuente

Fuente principal:

- `13.3 MVP incluido`
- `14.1 Features nucleo`
- `15. Modelo de Eventos`
- `17. APIs del MVP`
- `24. Sprints de Desarrollo`

Apoyo PDF:

- `Modulos principales del sistema`
- `Casos de uso del sistema para AgentWatch Latam`
- `Vision Arquitectonica`

## FEA-01 Gestion de organizaciones

**Objetivo**

Definir el tenant raiz del sistema y su configuracion minima operativa.

**Incluye**

- alta de organizacion;
- pais;
- zona horaria;
- plan;
- estado;
- base para retencion, notificaciones y configuracion regional.

**No incluye aun**

- facturacion completa;
- billing externo;
- politicas avanzadas de residencia de datos.

**Relacion documental**

- RF relacionados: `RF-05`, `RF-06`
- RNF relacionados: `RNF-02`, `RNF-04`
- CU relacionados: `CU-01`
- HU relacionadas: no aplica directa en el `.md`
- Backlog items relacionados: `BLI-002`
- Sprint dominante: `Sprint 1`

**Dependencias**

- auth base;
- usuarios;
- membresias.

**Criterios de aceptacion**

- se puede crear organizacion;
- queda asociada al usuario owner;
- el sistema puede usarla como limite de tenancy.

**Estado**

Cerrada para alcance Sprint 1.

## FEA-02 Gestion de usuarios y roles

**Objetivo**

Controlar acceso, visibilidad y capacidad de accion segun rol.

**Incluye**

- usuarios base;
- relacion usuario-organizacion;
- roles minimos;
- base para object-level access.

**No incluye aun**

- RBAC granular completo;
- SSO/SAML;
- politicas avanzadas por modulo.

**Relacion documental**

- RF relacionados: `RF-06`
- RNF relacionados: `RNF-02`
- CU relacionados: `CU-01`, `CU-07`, `CU-08`
- Backlog items relacionados: `BLI-001`, `BLI-002`, `BLI-102`, `BLI-106`
- Sprint dominante: `Sprint 1`

**Dependencias**

- organizaciones;
- auth de dashboard.

**Criterios de aceptacion**

- un owner puede existir por organizacion;
- las consultas usan membresias para limitar acceso;
- existe base para admin, operator, auditor, viewer e integrator.

**Estado**

Cerrada para alcance Sprint 1.

## FEA-03 Gestion de agentes

**Objetivo**

Registrar cada agente o automatizacion como entidad trazable y autenticable.

**Incluye**

- crear agente;
- tipo de agente;
- fuente;
- nivel de autonomia;
- estado;
- API key por agente;
- rotacion de API key.

**No incluye aun**

- comparacion multi-agente avanzada;
- conflictos entre agentes;
- agentes desktop con evidencia visual integrada.

**Relacion documental**

- RF relacionados: `RF-06`, `RF-07`
- RNF relacionados: `RNF-02`
- CU relacionados: `CU-02`
- HU relacionadas: `HU-01`
- Backlog items relacionados: `BLI-003`
- Sprint dominante: `Sprint 1`

**Dependencias**

- organizaciones;
- usuarios y roles.

**Criterios de aceptacion**

- un agente puede registrarse;
- obtiene API key;
- la key puede rotarse;
- queda ligado a una organizacion.

**Estado**

Cerrada para alcance Sprint 1.

## FEA-04 Ingesta de eventos

**Objetivo**

Recibir actividad desde agentes, workflows o integraciones sin perder trazabilidad.

**Incluye**

- `POST /api/v1/events`;
- validacion de payload;
- normalizacion;
- `idempotency_key`;
- persistencia en PostgreSQL;
- metadata y sensitive flags.

**No incluye aun**

- carga masiva completa;
- catalogo de providers webhook;
- colas o procesamiento async formal.

**Relacion documental**

- RF relacionados: `RF-02`, `RF-03`, `RF-05`
- RNF relacionados: `RNF-01`, `RNF-02`
- CU relacionados: `CU-03`
- HU relacionadas: `HU-02`
- Backlog items relacionados: `BLI-004`, `BLI-103`, `BLI-104`
- Sprint dominante: `Sprint 2`

**Dependencias**

- agentes;
- API key por agente;
- modelo `events`.

**Criterios de aceptacion**

- el agente autenticado puede enviar eventos;
- no se duplican si llega el mismo `idempotency_key`;
- el evento queda atribuible a tenant y agente.

**Estado**

Cerrada para el alcance MVP de Sprint 2.

## FEA-05 Timeline de actividad

**Objetivo**

Dar una lectura operativa y entendible del historial por tenant.

**Incluye**

- listado cronologico;
- filtros por organizacion, agente, fecha, tipo, riesgo y estado;
- detalle por evento;
- riesgo y estado visibles.

**No incluye aun**

- comparacion avanzada por agente;
- metricas historicas complejas.

**Relacion documental**

- RF relacionados: `RF-05`
- RNF relacionados: `RNF-01`, `RNF-04`
- CU relacionados: `CU-04`
- HU relacionadas: `HU-03`
- Backlog items relacionados: `BLI-005`, `BLI-105`
- Sprint dominante: `Sprint 3`

**Dependencias**

- ingesta de eventos;
- tenancy;
- auth de usuario.

**Criterios de aceptacion**

- el usuario ve eventos ordenados;
- puede filtrar;
- puede abrir detalle;
- no ve datos de otra organizacion.

**Estado**

Cerrada para el alcance MVP de Sprint 3 con dashboard principal conectado al API real.

## FEA-06 Explicacion en lenguaje natural

**Objetivo**

Traducir actividad tecnica a lenguaje de negocio en espanol.

**Incluye**

- plantillas por tipo de evento;
- `business_summary`;
- resumen fallback si no existe plantilla fina.

**No incluye aun**

- LLM externo en produccion;
- personalizacion por industria;
- resumen multinivel ejecutivo/tecnico por configuracion.

**Relacion documental**

- RF relacionados: `RF-02`
- RNF relacionados: `RNF-04`
- CU relacionados: `CU-05`
- HU relacionadas: `HU-04`
- Backlog items relacionados: `BLI-006`
- Sprint dominante: `Sprint 4`

**Dependencias**

- eventos persistidos;
- taxonomia de tipos de evento.

**Criterios de aceptacion**

- un evento tecnico se presenta como frase entendible;
- el resumen queda almacenado.

**Estado**

Cerrada para el alcance MVP de Sprint 4.

## FEA-07 Motor de riesgo

**Objetivo**

Clasificar eventos por impacto operativo para soporte de control humano.

**Incluye**

- `risk_level`;
- reglas base por tipo, volumen, sensibilidad y accion;
- `requires_approval`.

**No incluye aun**

- editor visual de reglas;
- riesgo por horario o anomalia historica;
- modelo ML.

**Relacion documental**

- RF relacionados: `RF-03`
- RNF relacionados: `RNF-02`
- CU relacionados: `CU-06`
- HU relacionadas: `HU-04`
- Backlog items relacionados: `BLI-007`, `BLI-008`
- Sprint dominante: `Sprint 4`

**Dependencias**

- ingesta;
- metadata consistente;
- taxonomia de eventos.

**Criterios de aceptacion**

- eventos masivos o destructivos suben de riesgo;
- el riesgo queda persistido y visible.

**Estado**

Cerrada para el alcance MVP de Sprint 4.

## FEA-08 Aprobaciones humanas

**Objetivo**

Introducir control humano sobre acciones delicadas.

**Incluye**

- crear aprobacion;
- listar pendientes;
- aprobar o rechazar;
- guardar usuario y decision.

**No incluye aun**

- SLA de expiracion avanzado;
- escalamiento multietapa;
- notificaciones multicanal completas.

**Relacion documental**

- RF relacionados: `RF-03`
- RNF relacionados: `RNF-02`
- CU relacionados: `CU-07`
- HU relacionadas: `HU-05`
- Backlog items relacionados: `BLI-008`, `BLI-009`
- Sprint dominante: `Sprint 5`

**Dependencias**

- motor de riesgo;
- roles;
- timeline.

**Criterios de aceptacion**

- un evento alto o critico puede generar aprobacion;
- un usuario autorizado puede decidir;
- la decision queda trazable.

**Estado**

Cerrada para el alcance MVP de Sprint 5.

## FEA-09 Reportes PDF

**Objetivo**

Generar evidencia exportable para cliente, auditor o owner.

**Incluye**

- rango de fechas;
- resumen ejecutivo;
- riesgos;
- errores;
- aprobaciones;
- anexo tecnico.

**No incluye aun**

- firma digital;
- compliance formal SRI/SAT/AEAT;
- marca blanca avanzada.

**Relacion documental**

- RF relacionados: `RF-04`
- RNF relacionados: `RNF-04`
- CU relacionados: `CU-08`
- HU relacionadas: `HU-06`
- Backlog items relacionados: `BLI-010`
- Sprint dominante: `Sprint 6`

**Dependencias**

- timeline;
- resumen;
- riesgo;
- aprobaciones.

**Criterios de aceptacion**

- se puede generar reporte por periodo;
- su contenido proviene de eventos reales;
- el reporte queda persistido y descargable;
- la vista web consume el API real.

**Estado**

Cerrada para el alcance MVP de Sprint 6.

## FEA-10 Notificaciones

**Objetivo**

Permitir reaccion oportuna frente a riesgo o decision pendiente.

**Incluye**

- email;
- registro de notificacion;
- base para n8n y luego WhatsApp.

**No incluye aun**

- WhatsApp productivo;
- Slack;
- web push.

**Relacion documental**

- RF relacionados: `RF-03`, `RF-08`
- RNF relacionados: `RNF-01`, `RNF-03`
- CU relacionados: `CU-09`
- HU relacionadas: `HU-07`
- Backlog items relacionados: `BLI-011`, `BLI-012`, `BLI-201`, `BLI-202`
- Sprint dominante: `Sprint 7`

**Dependencias**

- eventos clasificados;
- aprobaciones;
- contactos destino.

**Criterios de aceptacion**

- un evento critico o pendiente puede disparar notificacion;
- el intento queda registrado.

**Estado**

Pendiente.

## FEA-11 Evidencia visual opcional

**Objetivo**

Mantener abierta la capacidad de captura visual sin contaminar el core del MVP.

**Incluye**

- activacion manual;
- retencion diferenciada;
- almacenamiento separado;
- finalidad explicita.

**No incluye aun**

- captura continua por defecto;
- desktop recorder full;
- onboarding obligatorio con captura.

**Relacion documental**

- RF relacionados: `RF-01`
- RNF relacionados: `RNF-02`, `RNF-03`
- CU relacionados: futuro
- Backlog items relacionados: `BLI-203`
- Sprint dominante: fase posterior

**Dependencias**

- modelo de sesiones;
- seguridad;
- storage separado.

**Criterios de aceptacion**

- la evidencia visual solo existe como opcion;
- no redefine el core del producto.

**Estado**

Futuro.
