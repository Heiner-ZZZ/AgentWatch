from fastapi import FastAPI

from agentwatch_ai.api.v1.routes.events import router as events_router
from agentwatch_ai.api.v1.routes.health import router as health_router

app = FastAPI(title="AgentWatch AI Service", version="0.1.0")
app.include_router(health_router, prefix="/api/v1")
app.include_router(events_router, prefix="/api/v1")
