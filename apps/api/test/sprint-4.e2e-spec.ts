import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/infrastructure/database/services/database.service';

describe('Sprint 4 CU - business summaries and risk classification (e2e)', () => {
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
    await pool.query(readSql('004_agentwatch_sprint5_approvals.sql'));
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

  it('generates safe business summaries and calibrated risk levels for operational events', async () => {
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
        name: 'AgentWatch Sprint 4 Demo',
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
        name: 'Security Ops Agent',
        agentType: 'workflow_agent',
        source: 'internal',
        autonomyLevel: 'supervised',
      })
      .expect(201);

    const agentId = agentResponse.body.data.id as string;

    const rotateKeyResponse = await request(app.getHttpServer())
      .post(`/api/v1/agents/${agentId}/rotate-key`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const agentApiKey = rotateKeyResponse.body.data.apiKey as string;

    const permissionChangeResponse = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${agentApiKey}`)
      .send({
        agentId,
        eventType: 'PERMISSIONS_UPDATED',
        category: 'CONFIGURATION',
        source: 'INTERNAL',
        sourceApp: 'ADMIN_CONSOLE',
        occurredAt: '2026-06-15T09:20:00-05:00',
        technicalSummary: 'Role matrix updated for privileged operators.',
        metadata: {
          environment: 'production',
          permission_scope: 'admin',
        },
        sensitiveFlags: [],
        idempotencyKey: 's4-permissions-updated',
      })
      .expect(201);

    expect(permissionChangeResponse.body.data.businessSummary).toBe(
      'El agente actualizo permisos operativos de admin en admin console.',
    );
    expect(permissionChangeResponse.body.data.riskLevel).toBe('high');
    expect(permissionChangeResponse.body.data.status).toBe('pending_approval');
    expect(permissionChangeResponse.body.data.requiresApproval).toBe(true);

    const secretRotationResponse = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${agentApiKey}`)
      .send({
        agentId,
        eventType: 'SECRET_ROTATED',
        category: 'SECURITY',
        source: 'VAULT',
        sourceApp: 'VAULT',
        occurredAt: '2026-06-15T09:42:00-05:00',
        technicalSummary: 'Rotated api_key sk_live_secret_value for CRM integration.',
        metadata: {
          key_id: 'crm_integration_secret',
        },
        sensitiveFlags: [],
        idempotencyKey: 's4-secret-rotated',
      })
      .expect(201);

    expect(secretRotationResponse.body.data.businessSummary).toBe(
      'El agente ejecuto una operacion tecnica sensible en vault.',
    );
    expect(secretRotationResponse.body.data.businessSummary).not.toContain(
      'sk_live_secret_value',
    );
    expect(secretRotationResponse.body.data.riskLevel).toBe('medium');
    expect(secretRotationResponse.body.data.status).toBe('recorded');

    const safeFallbackResponse = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${agentApiKey}`)
      .send({
        agentId,
        eventType: 'CONTACT_REVIEW_COMPLETED',
        category: 'SYNCHRONIZATION',
        source: 'HUBSPOT',
        sourceApp: 'CRM',
        occurredAt: '2026-06-15T10:05:00-05:00',
        technicalSummary: 'Sync completed for 15 CRM records',
        metadata: {
          record_count: 15,
        },
        sensitiveFlags: [],
        idempotencyKey: 's4-contact-sync',
      })
      .expect(201);

    expect(safeFallbackResponse.body.data.businessSummary).toBe(
      'Sync completed for 15 CRM records.',
    );
    expect(safeFallbackResponse.body.data.riskLevel).toBe('low');
    expect(safeFallbackResponse.body.data.requiresApproval).toBe(false);

    const storedEvents = await pool.query(
      `
        SELECT event_type, business_summary, risk_level, status, requires_approval
        FROM events
        WHERE organization_id = $1
        ORDER BY occurred_at ASC
      `,
      [organizationId],
    );

    expect(storedEvents.rows).toEqual([
      {
        event_type: 'permissions_updated',
        business_summary: 'El agente actualizo permisos operativos de admin en admin console.',
        risk_level: 'high',
        status: 'pending_approval',
        requires_approval: true,
      },
      {
        event_type: 'secret_rotated',
        business_summary: 'El agente ejecuto una operacion tecnica sensible en vault.',
        risk_level: 'medium',
        status: 'recorded',
        requires_approval: false,
      },
      {
        event_type: 'contact_review_completed',
        business_summary: 'Sync completed for 15 CRM records.',
        risk_level: 'low',
        status: 'recorded',
        requires_approval: false,
      },
    ]);
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
