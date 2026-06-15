# Current Status

## Alcance esperado

Sprint 1 cubre:

- `FEA-01 Gestion de organizaciones`
- `FEA-02 Gestion de usuarios y roles`
- `FEA-03 Gestion de agentes`
- `BLI-001`
- `BLI-002`
- `BLI-003`

## Lo que esta realmente implementado

- login funcional de usuario en API;
- `me`, `logout` y `refresh` funcionales;
- sesion persistida en `auth_sessions`;
- creacion de organizacion con membresia owner;
- creacion de usuarios dentro de organizacion con rol;
- listado de usuarios acotado por tenant;
- organizaciones listadas por membresia del usuario;
- creacion de agente;
- emision de API key;
- rotacion de API key;
- chequeos de rol en acciones sensibles de organizaciones y agentes;
- prueba negativa para impedir que `operator` cree agentes;
- auditoria minima de login, refresh, logout, crear organizacion, crear agente y rotate key;
- prueba e2e dedicada para flujo Sprint 1.

## Lo que esta parcial

- el dashboard web no consume aun este flujo end-to-end.

## Lo que no debe confundirse con Sprint 1

Aunque el repositorio ya tiene avances de Sprint 2, 3 y 4, esos avances no forman parte del cierre de Sprint 1:

- ingesta de eventos;
- timeline;
- resumen en espanol;
- clasificacion de riesgo;
- aprobaciones.

## Juicio actual

Sprint 1 esta `cerrado para su alcance MVP`.
No significa `cerrado enterprise total`; significa que su alcance comprometido ya tiene implementacion, trazabilidad y evidencia tecnica suficientes.

Eso significa:

- sirve como fundacion real;
- tiene evidencia tecnica;
- puede darse por cerrado en planning sin bloquear Sprint 2;
- mejoras futuras de RBAC fino y UX conectada pasan a evolucion, no a bloqueo de cierre.
