import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/infrastructure/database/services/database.service';

describe('Sprint 3 CU - timeline filtering and tenant isolation (e2e)', () => {
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

  it('lists timeline entries, supports filters and blocks access to other organizations', async () => {
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
        name: 'AgentWatch Latam Timeline',
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
        name: 'Ops Timeline Agent',
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

    const emailEventResponse = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${agentApiKey}`)
      .send({
        agentId,
        eventType: 'EMAIL_SENT',
        category: 'COMMUNICATION',
        source: 'N8N',
        sourceApp: 'GMAIL',
        occurredAt: '2026-06-14T09:05:00-05:00',
        technicalSummary: 'Workflow sent outbound email.',
        metadata: {
          recipient_count: 14,
          workflow_id: 'wf_timeline_001',
        },
        sensitiveFlags: ['external_recipient'],
        idempotencyKey: 'timeline-001-email',
      })
      .expect(201);

    const exportEventResponse = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${agentApiKey}`)
      .send({
        agentId,
        eventType: 'FILE_EXPORTED',
        category: 'DATA_EXPORT',
        source: 'HUBSPOT',
        sourceApp: 'CRM',
        occurredAt: '2026-06-14T10:15:00-05:00',
        technicalSummary: 'Workflow exported CRM data.',
        metadata: {
          record_count: 28,
          workflow_id: 'wf_timeline_002',
        },
        sensitiveFlags: ['customer_data'],
        idempotencyKey: 'timeline-002-export',
      })
      .expect(201);

    const deleteEventResponse = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${agentApiKey}`)
      .send({
        agentId,
        eventType: 'RECORDS_DELETED',
        category: 'DATA_CHANGE',
        source: 'HUBSPOT',
        sourceApp: 'CRM',
        occurredAt: '2026-06-14T11:40:00-05:00',
        technicalSummary: 'Workflow deleted CRM records.',
        metadata: {
          record_count: 84,
          workflow_id: 'wf_timeline_003',
        },
        sensitiveFlags: ['customer_data'],
        idempotencyKey: 'timeline-003-delete',
      })
      .expect(201);

    const allTimelineResponse = await request(app.getHttpServer())
      .get(`/api/v1/events?organizationId=${organizationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(allTimelineResponse.body.data).toHaveLength(3);
    expect(allTimelineResponse.body.data.map((event: { id: string }) => event.id)).toEqual([
      deleteEventResponse.body.data.id,
      exportEventResponse.body.data.id,
      emailEventResponse.body.data.id,
    ]);

    const filteredByRiskResponse = await request(app.getHttpServer())
      .get(`/api/v1/events?organizationId=${organizationId}&riskLevel=critical`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(filteredByRiskResponse.body.data).toHaveLength(1);
    expect(filteredByRiskResponse.body.data[0]).toMatchObject({
      id: deleteEventResponse.body.data.id,
      agentId,
      eventType: 'records_deleted',
      riskLevel: 'critical',
      status: 'pending_approval',
      displaySummary: 'El agente elimino 84 registros en crm.',
    });

    const filteredByTypeAndDateResponse = await request(app.getHttpServer())
      .get(
        `/api/v1/events?organizationId=${organizationId}&agentId=${agentId}&eventType=file_exported&dateFrom=2026-06-14T15:00:00.000Z&dateTo=2026-06-14T15:30:00.000Z`,
      )
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(filteredByTypeAndDateResponse.body.data).toHaveLength(1);
    expect(filteredByTypeAndDateResponse.body.data[0]).toMatchObject({
      id: exportEventResponse.body.data.id,
      eventType: 'file_exported',
      category: 'data_export',
      source: 'hubspot',
      sourceApp: 'crm',
      riskLevel: 'high',
      status: 'pending_approval',
    });

    const detailResponse = await request(app.getHttpServer())
      .get(`/api/v1/events/${exportEventResponse.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(detailResponse.body.data).toMatchObject({
      id: exportEventResponse.body.data.id,
      organizationId,
      agentId,
      businessSummary: 'El agente exporto 28 registros desde crm.',
      technicalSummary: 'Workflow exported CRM data.',
      metadata: {
        record_count: 28,
        workflow_id: 'wf_timeline_002',
      },
      sensitiveFlags: ['customer_data'],
    });

    const outsiderUserId = randomUUID();
    const outsiderOrganizationId = randomUUID();
    const outsiderAgentId = randomUUID();
    const outsiderEventId = randomUUID();

    await pool.query(
      `
        INSERT INTO users (id, email, full_name, password_hash)
        VALUES ($1, $2, $3, $4)
      `,
      [
        outsiderUserId,
        'outsider@agentwatch.local',
        'Outsider Demo',
        '0ead2060b65992dca4769af601a1b3a35ef38cfad2c2c465bb160ea764157c5d',
      ],
    );
    await pool.query(
      `
        INSERT INTO organizations (id, name, country_code, timezone, plan, status)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        outsiderOrganizationId,
        'Outsider Org',
        'CO',
        'America/Bogota',
        'starter',
        'active',
      ],
    );
    await pool.query(
      `
        INSERT INTO organization_users (organization_id, user_id, role)
        VALUES ($1, $2, $3)
      `,
      [outsiderOrganizationId, outsiderUserId, 'owner'],
    );
    await pool.query(
      `
        INSERT INTO agents (id, organization_id, name, agent_type, source, status, autonomy_level)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        outsiderAgentId,
        outsiderOrganizationId,
        'Outsider Agent',
        'workflow_agent',
        'zapier',
        'active',
        'supervised',
      ],
    );
    await pool.query(
      `
        INSERT INTO events (
          id,
          organization_id,
          agent_id,
          event_type,
          category,
          source,
          source_app,
          occurred_at,
          risk_level,
          status,
          business_summary,
          technical_summary,
          metadata,
          sensitive_flags,
          requires_approval,
          idempotency_key
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13::jsonb,
          $14::jsonb,
          $15,
          $16
        )
      `,
      [
        outsiderEventId,
        outsiderOrganizationId,
        outsiderAgentId,
        'contact_synced',
        'data_sync',
        'zapier',
        'crm',
        '2026-06-14T12:15:00.000Z',
        'low',
        'recorded',
        'El agente sincronizo 4 contactos en crm.',
        'Outsider sync flow.',
        JSON.stringify({ record_count: 4, workflow_id: 'wf_outsider_001' }),
        JSON.stringify([]),
        false,
        'outsider-001-sync',
      ],
    );

    const forbiddenOrganizationTimelineResponse = await request(app.getHttpServer())
      .get(`/api/v1/events?organizationId=${outsiderOrganizationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(forbiddenOrganizationTimelineResponse.body.data).toEqual([]);

    await request(app.getHttpServer())
      .get(`/api/v1/events/${outsiderEventId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
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
