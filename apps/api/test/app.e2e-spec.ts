import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { createHash } from 'crypto';
import { DatabaseService } from '../src/infrastructure/database/services/database.service';

describe('Sprint 3-4 CU - timeline and risk (e2e)', () => {
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
    await pool.query(readSql('003_agentwatch_sprint2_events.sql'));
  });

  beforeEach(async () => {
    await pool.query(`
      TRUNCATE TABLE
        events,
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

  it('allows login, create organization, create agent, rotate key and ingest events', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'owner@agentwatch.local',
        password: 'demo1234',
      });

    if (loginResponse.status !== 201) {
      throw new Error(
        `Expected 201 for login but got ${loginResponse.status}: ${JSON.stringify(
          loginResponse.body,
        )}`,
      );
    }

    if (!loginResponse.body?.data?.token) {
      throw new Error(
        `Login succeeded but response body has no data.token: ${JSON.stringify(loginResponse.body)}`,
      );
    }

    const token = loginResponse.body.data.token as string;
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const sessions = await pool.query(
      'SELECT user_id, token_hash, created_at FROM auth_sessions ORDER BY created_at DESC',
    );

    if (sessions.rows.length === 0) {
      throw new Error('Login succeeded but no auth_sessions row was created.');
    }

    if (!sessions.rows.some((row) => row.token_hash === tokenHash)) {
      throw new Error(
        `Login token hash not found in auth_sessions. tokenHash=${tokenHash} rows=${JSON.stringify(
          sessions.rows,
        )}`,
      );
    }

    const organizationResponse = await request(app.getHttpServer())
      .post('/api/v1/organizations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'AgentWatch Latam Demo',
        countryCode: 'EC',
        timezone: 'America/Guayaquil',
        plan: 'starter',
      });

    if (organizationResponse.status !== 201) {
      throw new Error(
        `Expected 201 for organizations but got ${organizationResponse.status}: ${JSON.stringify(
          organizationResponse.body,
        )}`,
      );
    }

    const organizationId = organizationResponse.body.data.id as string;

    const agentResponse = await request(app.getHttpServer())
      .post('/api/v1/agents')
      .set('Authorization', `Bearer ${token}`)
      .send({
        organizationId,
        name: 'n8n Sales Agent',
        agentType: 'workflow_agent',
        source: 'n8n',
        autonomyLevel: 'supervised',
      })
      .expect(201);

    const agentId = agentResponse.body.data.id as string;
    const agentApiKey = agentResponse.body.data.apiKey as string;

    const rotateKeyResponse = await request(app.getHttpServer())
      .post(`/api/v1/agents/${agentId}/rotate-key`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect(({ body }) => {
        expect(body.data.apiKey).toMatch(/^aw_agent_/);
      });

    const rotatedAgentApiKey = rotateKeyResponse.body.data.apiKey as string;

    const eventPayload = {
      agentId,
      eventType: 'EMAIL_SENT',
      category: 'COMMUNICATION',
      source: 'N8N',
      sourceApp: 'GMAIL',
      occurredAt: '2026-06-14T10:32:00-05:00',
      technicalSummary: 'n8n workflow executed Gmail send operation.',
      metadata: {
        recipient_count: 18,
        workflow_id: 'wf_sales_001',
      },
      sensitiveFlags: ['external_recipient'],
      idempotencyKey: 'n8n-wf-sales-001-step-send-email',
    };

    const firstEventResponse = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${rotatedAgentApiKey}`)
      .send(eventPayload)
      .expect(201);

    expect(firstEventResponse.body.data.eventType).toBe('email_sent');
    expect(firstEventResponse.body.data.category).toBe('communication');
    expect(firstEventResponse.body.data.source).toBe('n8n');
    expect(firstEventResponse.body.data.status).toBe('recorded');
    expect(firstEventResponse.body.data.businessSummary).toBe(
      'El agente envio 18 mensajes desde gmail.',
    );
    expect(firstEventResponse.body.data.riskLevel).toBe('medium');

    const secondEventResponse = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${rotatedAgentApiKey}`)
      .send(eventPayload)
      .expect(201);

    expect(secondEventResponse.body.data.id).toBe(firstEventResponse.body.data.id);

    const thirdEventResponse = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${rotatedAgentApiKey}`)
      .send({
        ...eventPayload,
        eventType: 'FILE_EXPORTED',
        category: 'DATA_EXPORT',
        source: 'HUBSPOT',
        sourceApp: 'CRM',
        occurredAt: '2026-06-14T11:15:00-05:00',
        technicalSummary: 'Agent exported 52 CRM records.',
        metadata: {
          record_count: 52,
          workflow_id: 'wf_sales_002',
        },
        sensitiveFlags: ['customer_data'],
        idempotencyKey: 'n8n-wf-sales-002-step-export-crm',
      })
      .expect(201);

    expect(thirdEventResponse.body.data.businessSummary).toBe(
      'El agente exporto 52 registros desde crm.',
    );
    expect(thirdEventResponse.body.data.riskLevel).toBe('high');
    expect(thirdEventResponse.body.data.status).toBe('pending_approval');
    expect(thirdEventResponse.body.data.requiresApproval).toBe(true);

    const fourthEventResponse = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${rotatedAgentApiKey}`)
      .send({
        agentId,
        eventType: 'RECORDS_DELETED',
        category: 'DATA_CHANGE',
        source: 'HUBSPOT',
        sourceApp: 'CRM',
        occurredAt: '2026-06-14T11:31:00-05:00',
        technicalSummary: 'Agent deleted 84 customer records from CRM.',
        metadata: {
          record_count: 84,
          workflow_id: 'wf_sales_003',
        },
        sensitiveFlags: ['customer_data'],
        idempotencyKey: 'n8n-wf-sales-003-step-delete-crm',
      })
      .expect(201);

    expect(fourthEventResponse.body.data.businessSummary).toBe(
      'El agente elimino 84 registros en crm.',
    );
    expect(fourthEventResponse.body.data.riskLevel).toBe('critical');
    expect(fourthEventResponse.body.data.status).toBe('pending_approval');
    expect(fourthEventResponse.body.data.requiresApproval).toBe(true);

    const timelineResponse = await request(app.getHttpServer())
      .get(`/api/v1/events?organizationId=${organizationId}&riskLevel=critical`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(timelineResponse.body.data).toHaveLength(1);
    expect(timelineResponse.body.data[0]).toMatchObject({
      id: fourthEventResponse.body.data.id,
      agentId,
      agentName: 'n8n Sales Agent',
      eventType: 'records_deleted',
      category: 'data_change',
      source: 'hubspot',
      sourceApp: 'crm',
      status: 'pending_approval',
      riskLevel: 'critical',
      displaySummary: 'El agente elimino 84 registros en crm.',
    });

    const detailResponse = await request(app.getHttpServer())
      .get(`/api/v1/events/${fourthEventResponse.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(detailResponse.body.data).toMatchObject({
      id: fourthEventResponse.body.data.id,
      idempotencyKey: 'n8n-wf-sales-003-step-delete-crm',
      businessSummary: 'El agente elimino 84 registros en crm.',
      metadata: {
        record_count: 84,
        workflow_id: 'wf_sales_003',
      },
      sensitiveFlags: ['customer_data'],
    });
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
