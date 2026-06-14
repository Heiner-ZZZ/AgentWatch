export type AgentModel = {
  id: string;
  organizationId: string;
  name: string;
  agentType: string;
  source: string;
  description: string;
  autonomyLevel: 'read_only' | 'supervised' | 'limited_write' | 'autonomous';
  status: 'active' | 'inactive';
  apiKeyMasked: string;
  createdAt: string;
  updatedAt: string;
};
