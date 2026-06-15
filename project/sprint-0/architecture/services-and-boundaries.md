# Servicios y Boundaries

## Servicios internos previstos

- API Service
- Auth/RBAC
- Event Processor
- Risk Engine
- Approval Service
- Report Service
- Notification Service
- Audit Service

## Estado actual en repo

### Ya scaffolded

- `auth`
- `users`
- `organizations`
- `agents`
- `events`
- `approvals`
- `reports`
- `integrations`
- `notifications`
- `audit`

### Aun parciales

- `risk engine`
- `notification delivery`
- `report generation real`
- `persistencia real de Sprint 1`

## Boundary recomendado

- `web` no ejecuta acciones locales del sistema operativo
- `api` centraliza seguridad y dominio
- `ai service` no es source of truth de negocio
- desktop futuro debe hablar con `api`, no con `web` directamente
