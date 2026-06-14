-- AgentWatch Sprint 1 seed
-- Version: v1.0.0
-- Demo owner user and reference roles

INSERT INTO users (email, full_name, password_hash)
VALUES ('owner@agentwatch.local', 'Owner Demo', 'demo-password-hash')
ON CONFLICT (email) DO NOTHING;
