# Modelo de Eventos

## Campos base

- `event_id`
- `organization_id`
- `agent_id`
- `session_id`
- `event_type`
- `category`
- `source`
- `source_app`
- `occurred_at`
- `received_at`
- `risk_level`
- `status`
- `business_summary`
- `technical_summary`
- `metadata`
- `sensitive_flags`
- `requires_approval`
- `idempotency_key`

## Estados base

- `received`
- `normalized`
- `classified`
- `recorded`
- `pending_approval`
- `approved`
- `rejected`
- `failed`
- `ignored`

## Categorias base

- session
- communication
- file
- data
- workflow
- approval
- risk
- integration
- system
- report
- cost
- auth
