-- AgentWatch Sprint 1 seed
-- Version: v1.0.0
-- Demo owner user and reference roles

INSERT INTO users (email, full_name, password_hash)
VALUES ('owner@agentwatch.local', 'Owner Demo', '0ead2060b65992dca4769af601a1b3a35ef38cfad2c2c465bb160ea764157c5d')
ON CONFLICT (email) DO NOTHING;
