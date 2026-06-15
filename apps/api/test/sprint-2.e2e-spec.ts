import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/infrastructure/database/services/database.service';

describe('Sprint 2 CU - event ingestion and idempotency (e2e)', () => {
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

  it('accepts an event, stores it and deduplicates by idempotency key', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'owner@agentwatch.local',
        password: 'demo1234',
      })
      .expect(201);

    const token = loginResponse.body.data.token as string;

    const organizationResponse = await request(app.getHttpServer())
      .post('/api/v1/organizations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'AgentWatch Latam Demo',
        countryCode: 'EC',
        timezone: 'America/Guayaquil',
        plan: 'starter',
      })
      .expect(201);

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

    const rotateKeyResponse = await request(app.getHttpServer())
      .post(`/api/v1/agents/${agentId}/rotate-key`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const agentApiKey = rotateKeyResponse.body.data.apiKey as string;

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
      .set('Authorization', `Bearer ${agentApiKey}`)
      .send(eventPayload)
      .expect(201);

    expect(firstEventResponse.body.data.agentId).toBe(agentId);
    expect(firstEventResponse.body.data.organizationId).toBe(organizationId);
    expect(firstEventResponse.body.data.eventType).toBe('email_sent');
    expect(firstEventResponse.body.data.category).toBe('communication');
    expect(firstEventResponse.body.data.source).toBe('n8n');
    expect(firstEventResponse.body.data.sourceApp).toBe('gmail');

    const secondEventResponse = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${agentApiKey}`)
      .send(eventPayload)
      .expect(201);

    expect(secondEventResponse.body.data.id).toBe(firstEventResponse.body.data.id);

    const storedEvents = await pool.query(
      `
        SELECT organization_id, agent_id, event_type, category, source, source_app, metadata, sensitive_flags
        FROM events
        WHERE organization_id = $1 AND agent_id = $2
        ORDER BY created_at ASC
      `,
      [organizationId, agentId],
    );

    expect(storedEvents.rows).toHaveLength(1);
    expect(storedEvents.rows[0].organization_id).toBe(organizationId);
    expect(storedEvents.rows[0].agent_id).toBe(agentId);
    expect(storedEvents.rows[0].event_type).toBe('email_sent');
    expect(storedEvents.rows[0].category).toBe('communication');
    expect(storedEvents.rows[0].source).toBe('n8n');
    expect(storedEvents.rows[0].source_app).toBe('gmail');
    expect(storedEvents.rows[0].metadata).toMatchObject({
      recipient_count: 18,
      workflow_id: 'wf_sales_001',
    });
    expect(storedEvents.rows[0].sensitive_flags).toEqual(['external_recipient']);
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
