# Diagrama ER Inicial

## Entidades base

```text
users ---< organization_users >--- organizations ---< agents
organizations ---< events
organizations ---< approvals
organizations ---< notifications
organizations ---< reports
organizations ---< audit_logs
agents ---< api_keys
agents ---< agent_sessions
events --- approvals
```

## Entidades prioritarias P0

- `users`
- `organizations`
- `organization_users`
- `agents`
- `api_keys`
- `events`

## Entidades P1-P2 cercanas

- `approvals`
- `notifications`
- `reports`
- `risk_rules`
- `audit_logs`

## Tenant boundary

La frontera principal es `organization_id`.

Toda entidad visible o administrable debe ser rastreable a una organizacion.
