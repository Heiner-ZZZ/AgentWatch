from fastapi import APIRouter

from agentwatch_ai.schemas.events import EventSummaryRequest, EventSummaryResponse
from agentwatch_ai.services.summarizer import summarize_event

router = APIRouter(prefix="/events", tags=["events"])


@router.post("/summarize", response_model=EventSummaryResponse)
def summarize(payload: EventSummaryRequest) -> EventSummaryResponse:
    return summarize_event(payload)
