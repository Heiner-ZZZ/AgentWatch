import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/infrastructure/database/services/database.service';

describe('Sprint 6 CU - reports and executive evidence (e2e)', () => {
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
    await pool.query(readSql('005_agentwatch_sprint6_reports.sql'));
  });

  beforeEach(async () => {
    await pool.query(`
      TRUNCATE TABLE
        reports,
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

  it('generates a report from real events and approvals and allows download', async () => {
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
        name: 'AgentWatch Sprint 6 Demo',
        countryCode: 'EC',
        timezone: 'America/Guayaquil',
        plan: 'starter',
      })
      .expect(201);

    const organizationId = organizationResponse.body.data.id as string;

    const agentResponse = await request(app.getHttpServer())
      .post('/api/v1/agents')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        organizationId,
        name: 'Reports Agent',
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
        occurredAt: '2026-06-15T09:00:00-05:00',
        technicalSummary: 'Workflow exported 140 customer records.',
        metadata: {
          record_count: 140,
        },
        sensitiveFlags: ['customer_data'],
        idempotencyKey: 's6-export-1',
      })
      .expect(201);

    const pendingApprovalsResponse = await request(app.getHttpServer())
      .get('/api/v1/approvals')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(pendingApprovalsResponse.body.data).toHaveLength(1);
    const approvalId = pendingApprovalsResponse.body.data[0].id as string;

    await request(app.getHttpServer())
      .post(`/api/v1/approvals/${approvalId}/decision`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        decision: 'approve',
        comment: 'Aprobado para el reporte ejecutivo semanal.',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${agentApiKey}`)
      .send({
        agentId,
        eventType: 'EMAIL_SENT',
        category: 'COMMUNICATION',
        source: 'GOOGLE',
        sourceApp: 'GMAIL',
        occurredAt: '2026-06-15T10:30:00-05:00',
        technicalSummary: 'Campaign email sent to 12 recipients.',
        metadata: {
          recipient_count: 12,
        },
        sensitiveFlags: [],
        idempotencyKey: 's6-email-1',
      })
      .expect(201);

    const generatedReportResponse = await request(app.getHttpServer())
      .post('/api/v1/reports/generate')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        organizationId,
        periodStart: '2026-06-15T00:00:00-05:00',
        periodEnd: '2026-06-15T23:59:59-05:00',
      })
      .expect(201);

    expect(generatedReportResponse.body.data).toMatchObject({
      organizationId,
      mimeType: 'application/pdf',
      fileName: 'agentwatch-report-2026-06-15-to-2026-06-16.pdf',
      downloadPath: expect.stringContaining('/api/v1/reports/'),
    });
    expect(generatedReportResponse.body.data.executiveSummary).toContain('2 eventos');
    expect(generatedReportResponse.body.data.reportPayload.totals).toMatchObject({
      eventCount: 2,
      highRiskCount: 1,
      approvalCount: 1,
    });
    expect(generatedReportResponse.body.data.reportPayload.approvals).toMatchObject({
      pending: 0,
      approved: 1,
      rejected: 0,
    });
    expect(generatedReportResponse.body.data.reportPayload.highlights).toHaveLength(2);

    const reportId = generatedReportResponse.body.data.id as string;

    const listedReportsResponse = await request(app.getHttpServer())
      .get(`/api/v1/reports?organizationId=${encodeURIComponent(organizationId)}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(listedReportsResponse.body.data).toHaveLength(1);
    expect(listedReportsResponse.body.data[0].id).toBe(reportId);

    const reportDetailResponse = await request(app.getHttpServer())
      .get(`/api/v1/reports/${reportId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(reportDetailResponse.body.data).toMatchObject({
      id: reportId,
      organizationId,
      generatedByUserName: 'Owner Demo',
    });

    const downloadResponse = await request(app.getHttpServer())
      .get(`/api/v1/reports/${reportId}/download`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(downloadResponse.headers['content-type']).toContain('application/pdf');
    expect(downloadResponse.headers['content-disposition']).toContain(
      'attachment; filename="agentwatch-report-2026-06-15-to-2026-06-16.pdf"',
    );
    expect(downloadResponse.body).toBeInstanceOf(Buffer);
    expect(downloadResponse.body.toString('utf8', 0, 8)).toContain('%PDF-1.4');

    const storedReports = await pool.query(
      `
        SELECT file_name, mime_type, executive_summary
        FROM reports
        WHERE organization_id = $1
      `,
      [organizationId],
    );

    expect(storedReports.rows).toHaveLength(1);
    expect(storedReports.rows[0]).toMatchObject({
      file_name: 'agentwatch-report-2026-06-15-to-2026-06-16.pdf',
      mime_type: 'application/pdf',
    });
    expect(storedReports.rows[0].executive_summary).toContain('2 eventos');

    const auditRows = await pool.query(
      `
        SELECT action, target_type
        FROM audit_logs
        WHERE organization_id = $1
        ORDER BY created_at ASC
      `,
      [organizationId],
    );

    expect(auditRows.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: 'report.generated',
          target_type: 'report',
        }),
      ]),
    );

    expect(exportEventResponse.body.data.status).toBe('pending_approval');
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
