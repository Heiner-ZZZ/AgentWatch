# Backlog Committed

## Fuente

- `project/planning/backlog-items.md`
- `project/planning/features.md`
- `project/planning/sprints/sprint-1.md`

## Items comprometidos

| ID | Item | Feature | Estado | Evidencia |
|---|---|---|---|---|
| BLI-001 | Login y sesion de usuario | FEA-02 | cerrado Sprint 1 | `apps/api/test/sprint-1.e2e-spec.ts` |
| BLI-002 | Organizaciones y membresias | FEA-01 | cerrado Sprint 1 | `apps/api/test/sprint-1.e2e-spec.ts` |
| BLI-003 | Registro de agentes y rotate key | FEA-03 | cerrado Sprint 1 | `apps/api/test/sprint-1.e2e-spec.ts` |

## Definition of Done del sprint

- login funcional;
- organizacion creada;
- agente creado;
- API key rotada;
- persistencia real en PostgreSQL;
- trazabilidad documental visible.

## Deuda abierta que no bloquea la base del sprint

- RBAC mas fino;
- UI web conectada al flujo real.

## Endurecimiento aplicado despues de la base inicial

| Item | Estado | Evidencia |
|---|---|---|
| BLI-101 Logout y refresh reales | cerrado Sprint 1 | `apps/api/test/sprint-1.e2e-spec.ts` |
| BLI-102 RBAC minimo por rol y objeto | cerrado Sprint 1 | chequeos por rol y objeto en organizaciones/agentes y prueba negativa de operator |
| BLI-106 Auditoria de acciones criticas | cerrado Sprint 1 | registros en `audit_logs` validados por e2e |
