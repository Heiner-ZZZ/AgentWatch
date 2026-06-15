-- AgentWatch Sprint 5
-- Version: v1.3.0
-- Scope: approvals workflow for high and critical events

CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status VARCHAR(40) NOT NULL DEFAULT 'pending',
  decision VARCHAR(20),
  requested_reason TEXT,
  decision_comment TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at TIMESTAMPTZ,
  decided_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  resolution_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_blocking BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id)
);

CREATE INDEX IF NOT EXISTS idx_approvals_org_status_requested
  ON approvals (organization_id, status, requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_approvals_event_id
  ON approvals (event_id);
