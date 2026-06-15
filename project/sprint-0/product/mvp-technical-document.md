# Documento Tecnico MVP

## Objetivo

Construir un MVP de AgentWatch centrado en observabilidad basada en eventos para agentes AI y automatizaciones.

## Que entra en MVP

- organizaciones
- usuarios y roles simples
- agentes
- API y webhook para recibir eventos
- timeline de eventos
- resumen entendible en espanol
- riesgo basico
- aprobaciones humanas basicas
- reportes PDF
- notificaciones por email

## Que no entra en MVP inicial

- grabacion continua de pantalla por defecto
- desktop app completa como core
- self-hosted enterprise completo
- compliance legal certificado
- mobile app dedicada
- multi-agente avanzado con conflictos

## Stack aterrizado en este repo

- frontend: `Next.js` + `Tailwind` + `shadcn/ui`
- backend core: `NestJS`
- servicio AI separado: `FastAPI`
- base de datos: `PostgreSQL`
- cache y colas: `Redis`
- acceso a datos: `Drizzle`
- observabilidad: `OpenTelemetry`
- pruebas E2E web: `Playwright`

## Superficies del sistema

- `apps/web`: panel web
- `apps/api`: API principal y backend de dominio
- `services/ai`: resumen/riesgo AI
- `packages/*`: tipos y utilidades compartidas
- `infra/*`: soporte local e infraestructura

## Dominios funcionales del MVP

- auth
- users
- organizations
- agents
- events
- approvals
- reports
- notifications
- audit logs
- integrations

## Salida esperada de Sprint 0

- equipo alineado en alcance
- arquitectura explicable
- entidades iniciales definidas
- endpoints base definidos
- backlog operativo priorizado
