-- AgentWatch Sprint 6
-- Version: v1.4.0
-- Scope: PDF reports generated from events and approvals

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  generated_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(80) NOT NULL DEFAULT 'application/pdf',
  executive_summary TEXT NOT NULL,
  report_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_base64 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_org_created_at
  ON reports (organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reports_org_period
  ON reports (organization_id, period_start DESC, period_end DESC);
