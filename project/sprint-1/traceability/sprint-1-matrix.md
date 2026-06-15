# Sprint 1 Matrix

## Regla

Cada elemento de Sprint 1 debe poder seguirse desde fuente documental hasta evidencia tecnica.

## Matriz

| Tipo fuente | ID | Elemento | Feature | Backlog item | Evidencia tecnica | Estado |
|---|---|---|---|---|---|---|
| RF | RF-06 | Control de permisos | FEA-01, FEA-02, FEA-03 | BLI-002, BLI-003, BLI-102, BLI-106 | guardas, membresias, APIs protegidas | cerrado Sprint 1 |
| RNF | RNF-02 | Seguridad y privacidad | FEA-02, FEA-03 | BLI-001, BLI-003, BLI-101, BLI-106 | sesion + API key + tenancy + audit | cerrado Sprint 1 |
| CU | CU-01 | Administrar organizaciones y membresias | FEA-01, FEA-02 | BLI-001, BLI-002, BLI-101, BLI-106 | `apps/api/test/sprint-1.e2e-spec.ts` | cerrado |
| CU | CU-02 | Registrar agente y credencial | FEA-03 | BLI-003, BLI-102, BLI-106 | `apps/api/test/sprint-1.e2e-spec.ts` | cerrado |
| HU | HU-01 | Registrar agente | FEA-03 | BLI-003, BLI-102 | `apps/api/test/sprint-1.e2e-spec.ts` | cerrado |
| Sprint | 24.3 | Auth, organizaciones y agentes | FEA-01, FEA-02, FEA-03 | BLI-001, BLI-002, BLI-003, BLI-101, BLI-102, BLI-106 | `project/sprint-1/` + test dedicado | cerrado |

## Evidencia principal

- `apps/api/test/sprint-1.e2e-spec.ts`
- `scripts/db/v1/001_agentwatch_sprint1_core.sql`
- `scripts/db/v1/002_agentwatch_sprint1_seed.sql`
- `apps/api/src/modules/auth/*`
- `apps/api/src/modules/organizations/*`
- `apps/api/src/modules/agents/*`
