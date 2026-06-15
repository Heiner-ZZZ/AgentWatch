# Arquitectura MVP

## Vista general

```text
[Web / Integradores / Agentes / n8n / Make / Scripts]
                         |
                         v
                  [NestJS API Core]
               /          |          \
              /           |           \
             v            v            v
     [Auth + RBAC]   [Event Flow]   [Report Flow]
                          |              |
                          v              v
                    [PostgreSQL]     [PDF / Storage]
                          |
                          v
                        [Redis]
                          |
                          v
                 [Notifications / Jobs]

                  [FastAPI AI Service]
                          ^
                          |
                  summaries / risk hints
```

## Responsabilidades

### `apps/web`

- dashboard
- organizaciones
- usuarios
- agentes
- aprobaciones
- reportes

### `apps/api`

- auth
- CRUD de dominio
- validacion
- reglas de negocio
- orquestacion
- exposicion REST

### `services/ai`

- resumen de eventos
- sugerencia de riesgo
- futuras funciones de NLP/LLM

## Principios

- multi-tenant desde organizaciones
- metadata primero
- endpoints versionados
- servicio AI desacoplado del core
- frontend y backend separados fisicamente
- desktop futuro como app adicional, no embebida en web
