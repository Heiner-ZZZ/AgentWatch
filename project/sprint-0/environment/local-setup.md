# Entorno Local

## Requisitos

- Node.js
- npm
- Python
- Docker

## Comandos principales

### Workspace

```bash
npm install
```

### Web

```bash
npm run dev:web
```

### API

```bash
npm run dev:api
```

### AI Service

```bash
npm run dev:ai
```

### Infra local

```bash
docker compose -f infra/docker/docker-compose.yml up -d
```

## Estado actual

- `web`: compila
- `api`: compila
- `api`: e2e de Sprint 1 pasa
- `ai service`: carga correctamente

## Variables utiles para dashboard real

Para que `apps/web` consuma el API real en el dashboard:

- `AGENTWATCH_API_BASE_URL`
- `AGENTWATCH_DASHBOARD_EMAIL`
- `AGENTWATCH_DASHBOARD_PASSWORD`

Defaults locales actuales:

- `AGENTWATCH_API_BASE_URL=http://localhost:4000/api/v1`
- `AGENTWATCH_DASHBOARD_EMAIL=owner@agentwatch.local`
- `AGENTWATCH_DASHBOARD_PASSWORD=demo1234`
