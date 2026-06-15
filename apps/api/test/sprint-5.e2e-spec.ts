import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/infrastructure/database/services/database.service';

describe('Sprint 5 CU - human approvals for high-risk events (e2e)', () => {
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
        approvals,
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

  it('creates pending approvals for high-risk events and allows authorized users to approve or reject them', async () => {
    const ownerLoginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'owner@agentwatch.local',
        password: 'demo1234',
      })
      .expect(201);

    const ownerToken = ownerLoginResponse.body.data.token as string;

    const organizationResponse = await request(app.getHttpServer())
      .post('/api/v1/organizations')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'AgentWatch Sprint 5 Demo',
        countryCode: 'EC',
        timezone: 'America/Guayaquil',
        plan: 'starter',
      })
      .expect(201);

    const organizationId = organizationResponse.body.data.id as string;

    await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        organizationId,
        email: 'operator@agentwatch.local',
        fullName: 'Operator Demo',
        password: 'demo5678',
        role: 'operator',
        status: 'active',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        organizationId,
        email: 'viewer@agentwatch.local',
        fullName: 'Viewer Demo',
        password: 'demo9999',
        role: 'viewer',
        status: 'active',
      })
      .expect(201);

    const operatorLoginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'operator@agentwatch.local',
        password: 'demo5678',
      })
      .expect(201);

    const operatorToken = operatorLoginResponse.body.data.token as string;

    const viewerLoginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'viewer@agentwatch.local',
        password: 'demo9999',
      })
      .expect(201);

    const viewerToken = viewerLoginResponse.body.data.token as string;

    const agentResponse = await request(app.getHttpServer())
      .post('/api/v1/agents')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        organizationId,
        name: 'Approval Flow Agent',
        agentType: 'workflow_agent',
        source: 'n8n',
        autonomyLevel: 'supervised',
      })
      .expect(201);

    const agentId = agentResponse.body.data.id as string;

    const rotateKeyResponse = await request(app.getHttpServer())
      .post(`/api/v1/agents/${agentId}/rotate-key`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201);

    const agentApiKey = rotateKeyResponse.body.data.apiKey as string;

    const exportEventResponse = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${agentApiKey}`)
      .send({
        agentId,
        eventType: 'FILE_EXPORTED',
        category: 'DATA_EXPORT',
        source: 'HUBSPOT',
        sourceApp: 'CRM',
        occurredAt: '2026-06-15T11:10:00-05:00',
        technicalSummary: 'Workflow exported sensitive CRM data.',
        metadata: {
          record_count: 120,
        },
        sensitiveFlags: ['customer_data'],
        idempotencyKey: 's5-export-approval',
      })
      .expect(201);

    expect(exportEventResponse.body.data.status).toBe('pending_approval');
    expect(exportEventResponse.body.data.requiresApproval).toBe(true);

    const pendingApprovalsResponse = await request(app.getHttpServer())
      .get('/api/v1/approvals')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(pendingApprovalsResponse.body.data).toHaveLength(1);
    expect(pendingApprovalsResponse.body.data[0]).toMatchObject({
      organizationId,
      eventId: exportEventResponse.body.data.id,
      status: 'pending',
      riskLevel: 'high',
      eventStatus: 'pending_approval',
      businessSummary: 'El agente exporto 120 registros desde crm.',
      agentName: 'Approval Flow Agent',
    });

    const approvalId = pendingApprovalsResponse.body.data[0].id as string;

    await request(app.getHttpServer())
      .post(`/api/v1/approvals/${approvalId}/decision`)
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({
        decision: 'approve',
        comment: 'Intento sin permisos',
      })
      .expect(403);

    const approvedResponse = await request(app.getHttpServer())
      .post(`/api/v1/approvals/${approvalId}/decision`)
      .set('Authorization', `Bearer ${operatorToken}`)
      .send({
        decision: 'approve',
        comment: 'Aprobado por operador para continuar el flujo.',
      })
      .expect(201);

    expect(approvedResponse.body.data).toMatchObject({
      id: approvalId,
      status: 'approved',
      decision: 'approve',
      decisionComment: 'Aprobado por operador para continuar el flujo.',
      decidedByUserId: expect.any(String),
      decidedByUserName: 'Operator Demo',
      eventStatus: 'approved',
    });

    const eventAfterApproval = await request(app.getHttpServer())
      .get(`/api/v1/events/${exportEventResponse.body.data.id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(eventAfterApproval.body.data.status).toBe('approved');

    const deleteEventResponse = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${agentApiKey}`)
      .send({
        agentId,
        eventType: 'RECORDS_DELETED',
        category: 'DATA_CHANGE',
        source: 'HUBSPOT',
        sourceApp: 'CRM',
        occurredAt: '2026-06-15T11:48:00-05:00',
        technicalSummary: 'Workflow deleted 84 CRM records.',
        metadata: {
          record_count: 84,
        },
        sensitiveFlags: ['customer_data'],
        idempotencyKey: 's5-delete-approval',
      })
      .expect(201);

    const approvalsAfterSecondEvent = await pool.query(
      `
        SELECT id, status, event_id
        FROM approvals
        WHERE organization_id = $1
        ORDER BY requested_at ASC
      `,
      [organizationId],
    );

    expect(approvalsAfterSecondEvent.rows).toHaveLength(2);
    expect(approvalsAfterSecondEvent.rows[1].status).toBe('pending');
    expect(approvalsAfterSecondEvent.rows[1].event_id).toBe(deleteEventResponse.body.data.id);

    const secondPendingApprovalsResponse = await request(app.getHttpServer())
      .get('/api/v1/approvals')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(secondPendingApprovalsResponse.body.data).toHaveLength(1);
    const secondApprovalId = secondPendingApprovalsResponse.body.data[0].id as string;

    const rejectedResponse = await request(app.getHttpServer())
      .post(`/api/v1/approvals/${secondApprovalId}/decision`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        decision: 'reject',
        comment: 'No se autoriza eliminacion masiva de registros.',
      })
      .expect(201);

    expect(rejectedResponse.body.data).toMatchObject({
      id: secondApprovalId,
      status: 'rejected',
      decision: 'reject',
      eventStatus: 'rejected',
    });

    const auditRows = await pool.query(
      `
        SELECT action
        FROM audit_logs
        WHERE organization_id = $1
        ORDER BY created_at ASC
      `,
      [organizationId],
    );

    expect(auditRows.rows.map((row) => row.action)).toEqual(
      expect.arrayContaining([
        'approval.created',
        'approval.approved',
        'approval.rejected',
      ]),
    );

    const storedApprovals = await pool.query(
      `
        SELECT status, decision, decision_comment
        FROM approvals
        WHERE organization_id = $1
        ORDER BY requested_at ASC
      `,
      [organizationId],
    );

    expect(storedApprovals.rows).toEqual([
      {
        status: 'approved',
        decision: 'approve',
        decision_comment: 'Aprobado por operador para continuar el flujo.',
      },
      {
        status: 'rejected',
        decision: 'reject',
        decision_comment: 'No se autoriza eliminacion masiva de registros.',
      },
    ]);

    expect(deleteEventResponse.body.data.status).toBe('pending_approval');
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
