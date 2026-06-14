from agentwatch_ai.schemas.events import EventSummaryRequest, EventSummaryResponse


def summarize_event(payload: EventSummaryRequest) -> EventSummaryResponse:
    summary = (
        f"El agente registro un evento {payload.event_type} desde {payload.source}."
    )
    return EventSummaryResponse(business_summary=summary, risk_hint="medium")
