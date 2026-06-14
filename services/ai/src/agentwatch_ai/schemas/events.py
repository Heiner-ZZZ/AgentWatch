from pydantic import BaseModel, Field


class EventSummaryRequest(BaseModel):
    event_type: str = Field(min_length=1)
    source: str = Field(min_length=1)
    technical_summary: str = Field(min_length=1)


class EventSummaryResponse(BaseModel):
    business_summary: str
    risk_hint: str
