import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/infrastructure/database/services/database.service';

describe('Sprint 1 CU - auth, organizations and agents (e2e)', () => {
  let app: INestApplication<App>;
  let pool: Pool;
  let databaseService: DatabaseService;

  const readSql = (filename: string) =>
    readFileSync(
      join(__dirname, '..', '..', '..', 'scripts', 'db', 'v1', filename),
      'utf8',
    );

  beforeAll(async () => {
    pool = new Pool({
      connectionString:
        process.env.POSTGRES_URL ??
        'postgresql://agentwatch:agentwatch@localhost:5432/agentwatch',
    });

    await pool.query(readSql('001_agentwatch_sprint1_core.sql'));
    await pool.query(readSql('004_agentwatch_sprint5_approvals.sql'));
  });

  beforeEach(async () => {
    await pool.query(`
      TRUNCATE TABLE
        approvals,
        auth_sessions,
        api_keys,
        agents,
        organization_users,
        organizations,
        users
      RESTART IDENTITY CASCADE;
    `);
    await pool.query(readSql('002_agentwatch_sprint1_seed.sql'));

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    databaseService = app.get(DatabaseService);
  });

  it('allows login, refresh, create organization, create users by role, create agent, rotate key and logout', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'owner@agentwatch.local',
        password: 'demo1234',
      })
      .expect(201);

    expect(loginResponse.body.data.token).toMatch(/^aw_session_/);

    const token = loginResponse.body.data.token as string;
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const sessions = await pool.query(
      'SELECT user_id, token_hash, expires_at FROM auth_sessions ORDER BY created_at DESC',
    );

    expect(sessions.rows.some((row) => row.token_hash === tokenHash)).toBe(true);
    expect(sessions.rows[0].expires_at).toBeTruthy();

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(meResponse.body.data.sessionId).toBeTruthy();

    const refreshResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({
        refreshToken: token,
      })
      .expect(201);

    const refreshedToken = refreshResponse.body.data.token as string;

    expect(refreshedToken).toMatch(/^aw_session_/);
    expect(refreshedToken).not.toBe(token);

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);

    const organizationResponse = await request(app.getHttpServer())
      .post('/api/v1/organizations')
      .set('Authorization', `Bearer ${refreshedToken}`)
      .send({
        name: 'AgentWatch Latam Demo',
        countryCode: 'EC',
        timezone: 'America/Guayaquil',
        plan: 'starter',
      })
      .expect(201);

    const organizationId = organizationResponse.body.data.id as string;
    const memberships = await pool.query(
      'SELECT organization_id, role FROM organization_users ORDER BY created_at DESC',
    );

    expect(
      memberships.rows.some(
        (row) => row.organization_id === organizationId && row.role === 'owner',
      ),
    ).toBe(true);

    const createOperatorResponse = await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${refreshedToken}`)
      .send({
        organizationId,
        email: 'operator@agentwatch.local',
        fullName: 'Operator Demo',
        password: 'demo5678',
        role: 'operator',
        status: 'active',
      })
      .expect(201);

    expect(createOperatorResponse.body.data.email).toBe('operator@agentwatch.local');

    const usersResponse = await request(app.getHttpServer())
      .get(`/api/v1/users?organizationId=${organizationId}`)
      .set('Authorization', `Bearer ${refreshedToken}`)
      .expect(200);

    expect(
      usersResponse.body.data.some(
        (user: { email: string }) => user.email === 'operator@agentwatch.local',
      ),
    ).toBe(true);

    const operatorLoginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'operator@agentwatch.local',
        password: 'demo5678',
      })
      .expect(201);

    const operatorToken = operatorLoginResponse.body.data.token as string;

    const agentResponse = await request(app.getHttpServer())
      .post('/api/v1/agents')
      .set('Authorization', `Bearer ${refreshedToken}`)
      .send({
        organizationId,
        name: 'n8n Sales Agent',
        agentType: 'workflow_agent',
        source: 'n8n',
        autonomyLevel: 'supervised',
      })
      .expect(201);

    const agentId = agentResponse.body.data.id as string;
    const originalApiKey = agentResponse.body.data.apiKey as string;

    expect(originalApiKey).toMatch(/^aw_agent_/);

    const rotateKeyResponse = await request(app.getHttpServer())
      .post(`/api/v1/agents/${agentId}/rotate-key`)
      .set('Authorization', `Bearer ${refreshedToken}`)
      .expect(201);

    const rotatedApiKey = rotateKeyResponse.body.data.apiKey as string;

    expect(rotatedApiKey).toMatch(/^aw_agent_/);
    expect(rotatedApiKey).not.toBe(originalApiKey);

    await request(app.getHttpServer())
      .post('/api/v1/agents')
      .set('Authorization', `Bearer ${operatorToken}`)
      .send({
        organizationId,
        name: 'Operator Forbidden Agent',
        agentType: 'workflow_agent',
        source: 'n8n',
        autonomyLevel: 'supervised',
      })
      .expect(403);

    const organizationsListResponse = await request(app.getHttpServer())
      .get('/api/v1/organizations')
      .set('Authorization', `Bearer ${refreshedToken}`)
      .expect(200);

    expect(
      organizationsListResponse.body.data.some(
        (organization: { id: string }) => organization.id === organizationId,
      ),
    ).toBe(true);

    await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${refreshedToken}`)
      .expect(201);

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${refreshedToken}`)
      .expect(401);

    const auditRows = await pool.query(
      'SELECT action FROM audit_logs ORDER BY created_at ASC',
    );

    expect(auditRows.rows.map((row) => row.action)).toEqual(
      expect.arrayContaining([
        'auth.login',
        'auth.refresh',
        'organization.created',
        'user.created',
        'agent.created',
        'agent.key_rotated',
        'auth.logout',
      ]),
    );
  });

  afterEach(async () => {
    if (databaseService) {
      await databaseService.close();
    }
    if (app) {
      await app.close();
    }
  });

  afterAll(async () => {
    if (pool) {
      await pool.end();
    }
  });
});
