# AgentWatch

AgentWatch es una plataforma enterprise de observabilidad, auditoria y control para agentes AI y automatizaciones. Su objetivo es ayudar a empresas, integradores y equipos operativos de Latam y Espana a entender que hizo un agente, detectar riesgo, aprobar acciones delicadas y generar evidencia clara en espanol.

## Propuesta de valor

AgentWatch convierte eventos tecnicos de agentes, workflows e integraciones en un historial entendible para negocio.

La plataforma permite:

- registrar actividad de agentes y automatizaciones;
- traducir eventos tecnicos a lenguaje de negocio en espanol;
- clasificar riesgo operativo;
- solicitar aprobaciones humanas para acciones sensibles;
- generar reportes exportables;
- mantener trazabilidad y auditoria por organizacion.

## Problema que resuelve

Muchas herramientas de observabilidad para agentes AI estan pensadas para equipos tecnicos, en ingles y con integraciones complejas. AgentWatch apunta a un mercado distinto: empresas y operadores que necesitan control, evidencia y explicaciones claras sin depender de instrumentacion pesada ni de equipos avanzados de ML.

## Enfoque del MVP

El MVP v1.1 prioriza observabilidad basada en eventos. La captura visual continua no es el nucleo del producto.

Capacidades incluidas:

- organizaciones, usuarios y roles;
- registro de agentes;
- API y webhook para ingesta de eventos;
- timeline de actividad;
- resumen en espanol por evento;
- clasificacion basica de riesgo;
- aprobaciones humanas;
- notificaciones;
- reportes PDF;
- evidencia visual opcional y manual.

## Usuarios objetivo

- integradores y agencias que implementan automatizaciones para clientes;
- freelancers tecnicos y vibecoders que necesitan trazabilidad simple;
- PYMEs que ya usan agentes AI o flujos automatizados;
- equipos operativos y de supervision que requieren historial, control y reportes.

## Dominios funcionales

La plataforma se apoya en estos dominios principales:

- `organizations`: empresas o espacios de trabajo;
- `users` y `roles`: control de acceso y responsabilidades;
- `agents`: agentes AI, scripts, workflows y automatizaciones monitoreadas;
- `events`: registro central de actividad;
- `risk_rules`: reglas de riesgo y control;
- `approvals`: aprobaciones humanas;
- `notifications`: alertas y avisos operativos;
- `reports`: reportes exportables;
- `audit_logs`: trazabilidad de cambios sensibles.

## Arquitectura funcional

Flujo principal del producto:

1. Un agente o integracion envia eventos.
2. AgentWatch valida, normaliza y almacena la actividad.
3. El sistema genera resumen entendible y clasifica riesgo.
4. Si aplica, crea una aprobacion humana.
5. El evento aparece en timeline, alertas y reportes.

## Mercado objetivo

El enfoque comercial inicial esta en Latam hispanohablante y Espana:

- Ecuador
- Colombia
- Peru
- Mexico
- Espana

La propuesta combina observabilidad, control operativo y reportes orientados a contextos de negocio y cumplimiento regional.

## Multi-dominio de producto

AgentWatch contempla una estrategia de superficies sobre dominios `.com`, `.ai` y `.so` como parte de un mismo ecosistema digital. La implementacion debe mantener coherencia de producto, identidad, seguridad y configuracion entre esas superficies.

## Documentacion base

La definicion actual del producto se apoya en:

- [Docs/Docs_No_Eliminar/AgentWatch_Latam_requerimientos_v1_0_1_actualizado.md](Docs/Docs_No_Eliminar/AgentWatch_Latam_requerimientos_v1_0_1_actualizado.md)
- [Docs/Docs_No_Eliminar/AgentWatch_Latam_requerimientos_V1.md](Docs/Docs_No_Eliminar/AgentWatch_Latam_requerimientos_V1.md)
- `Docs/Docs_No_Eliminar/AgentWatch_Latam_documento_empresarial_arquitectonico.pdf`
