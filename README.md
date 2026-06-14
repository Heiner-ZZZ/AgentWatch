# AgentWatch

AgentWatch es una plataforma enterprise de observabilidad, auditoria y control para agentes AI y automatizaciones. Su enfoque no es una app generica de IA ni un chatbot de demostracion: el producto busca registrar eventos, explicarlos en espanol, detectar riesgo, solicitar aprobaciones humanas y generar reportes utilizables por negocio, integradores, clientes y auditoria.

## Vision del producto

AgentWatch esta pensado para PYMEs, integradores y equipos operativos de Latam y Espana que ya usan agentes AI, flujos n8n/Make o automatizaciones custom, pero necesitan una capa de trazabilidad y control.

La propuesta central del MVP v1.1 es:

> Mirar que hizo el agente, entenderlo en espanol, aprobar lo delicado y generar evidencia compartible.

## Enfoque actual

El core actual del producto es observabilidad basada en eventos, no grabacion continua de pantalla.

Capacidades principales del MVP:

- gestion de organizaciones, usuarios, roles y agentes;
- ingesta de eventos por API y webhook;
- timeline entendible por negocio;
- clasificacion basica de riesgo;
- aprobaciones humanas para acciones sensibles;
- notificaciones;
- reportes PDF en espanol;
- evidencia visual opcional y manual, desactivada por defecto.

## Usuarios objetivo

- integradores y agencias que implementan automatizaciones para clientes;
- vibecoders y freelancers tecnicos que necesitan trazabilidad sin instrumentacion pesada;
- duenos y operadores de PYMEs que necesitan entender que hizo un agente sin leer logs tecnicos.

## Arquitectura funcional

Las piezas principales del producto son:

- `organizations`: tenant principal de la plataforma.
- `agents`: agentes AI, workflows, scripts o automatizaciones monitoreadas.
- `events`: registro central de actividad.
- `risk_rules`: reglas de clasificacion y bloqueo.
- `approvals`: decisiones humanas sobre acciones delicadas.
- `notifications`: alertas y avisos operativos.
- `reports`: reportes exportables para negocio y auditoria.
- `audit_logs`: trazabilidad interna de cambios sensibles.

## Multi-dominio

El proyecto contempla trabajar con superficies sobre dominios `.com`, `.ai` y `.so` como parte de un mismo ecosistema de producto. El repositorio y las skills deben asumir que esos dominios pertenecen a una estrategia coordinada de plataforma y no a demos separadas.

Mientras la asignacion exacta de responsabilidades por dominio se termina de definir, cualquier implementacion debe:

- mantener coherencia de marca y producto;
- evitar duplicar logica por dominio;
- modelar claramente URLs, callbacks, auth y configuracion por superficie.

## Documentacion base

La vision y el alcance actual del proyecto estan sustentados por:

- [Docs/Docs_No_Eliminar/AgentWatch_Latam_requerimientos_v1_0_1_actualizado.md](Docs/Docs_No_Eliminar/AgentWatch_Latam_requerimientos_v1_0_1_actualizado.md)
- [Docs/Docs_No_Eliminar/AgentWatch_Latam_requerimientos_V1.md](Docs/Docs_No_Eliminar/AgentWatch_Latam_requerimientos_V1.md)
- `Docs/Docs_No_Eliminar/AgentWatch_Latam_documento_empresarial_arquitectonico.pdf`

## Estado del repositorio

En este momento el repositorio esta orientado a definicion de producto, arquitectura y skills de trabajo para Codex alineadas al dominio AgentWatch. Aun no hay una implementacion completa del sistema en este repo.

## Skills locales

Durante esta fase se estan usando skills locales especializadas para:

- backend enterprise enfocado en AgentWatch;
- frontend UI/UX orientado a dashboard, aprobaciones y reportes;
- arquitectura enterprise;
- gobierno de datos;
- seguridad transversal.

Las versiones temporales de trabajo viven en `.tmp-skills/`, pero esa carpeta se ignora en Git porque sirve como espacio local de iteracion.
