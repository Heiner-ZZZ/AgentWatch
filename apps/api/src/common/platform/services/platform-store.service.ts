import { Injectable } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';

export type UserRecord = {
  id: string;
  email: string;
  fullName: string;
  password: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

export type OrganizationRecord = {
  id: string;
  name: string;
  countryCode: string;
  timezone: string;
  plan: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

export type OrganizationMembershipRecord = {
  id: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'operator' | 'auditor' | 'viewer' | 'integrator';
  createdAt: string;
};

export type AgentRecord = {
  id: string;
  organizationId: string;
  name: string;
  agentType: string;
  source: string;
  description: string;
  autonomyLevel: 'read_only' | 'supervised' | 'limited_write' | 'autonomous';
  status: 'active' | 'inactive';
  apiKey: string;
  createdAt: string;
  updatedAt: string;
};

export type SessionRecord = {
  token: string;
  userId: string;
  createdAt: string;
};

@Injectable()
export class PlatformStoreService {
  readonly users: UserRecord[] = [];
  readonly organizations: OrganizationRecord[] = [];
  readonly memberships: OrganizationMembershipRecord[] = [];
  readonly agents: AgentRecord[] = [];
  readonly sessions: SessionRecord[] = [];

  constructor() {
    const now = this.now();
    this.users.push({
      id: this.generateId(),
      email: 'owner@agentwatch.local',
      fullName: 'Owner Demo',
      password: 'demo1234',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
  }

  now() {
    return new Date().toISOString();
  }

  generateId() {
    return randomUUID();
  }

  generateToken(prefix: string) {
    return `${prefix}_${randomBytes(16).toString('hex')}`;
  }
}
