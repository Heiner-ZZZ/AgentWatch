-- AgentWatch Sprint 2
-- Version: v1.1.0
-- Scope: events ingestion, normalization, idempotency

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  session_id VARCHAR(120),
  event_type VARCHAR(100) NOT NULL,
  category VARCHAR(80) NOT NULL,
  source VARCHAR(80) NOT NULL,
  source_app VARCHAR(80),
  occurred_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  risk_level VARCHAR(40) NOT NULL DEFAULT 'low',
  status VARCHAR(40) NOT NULL DEFAULT 'received',
  business_summary TEXT,
  technical_summary TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  sensitive_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  requires_approval BOOLEAN NOT NULL DEFAULT false,
  idempotency_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_events_org_time ON events (organization_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_agent_time ON events (agent_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON events (event_type);
CREATE INDEX IF NOT EXISTS idx_events_status ON events (status);
