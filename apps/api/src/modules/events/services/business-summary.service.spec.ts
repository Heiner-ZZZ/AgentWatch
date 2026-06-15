import { BusinessSummaryService } from './business-summary.service';

describe('BusinessSummaryService', () => {
  const service = new BusinessSummaryService();

  it('builds a business summary for outbound email events', () => {
    expect(
      service.generate({
        eventType: 'email_sent',
        source: 'n8n',
        sourceApp: 'gmail',
        technicalSummary: null,
        metadata: {
          recipient_count: 14,
        },
      }),
    ).toBe('El agente envio 14 mensajes desde gmail.');
  });

  it('builds a business summary for permission changes with scope context', () => {
    expect(
      service.generate({
        eventType: 'permissions_updated',
        source: 'internal',
        sourceApp: 'admin_console',
        technicalSummary: null,
        metadata: {
          permission_scope: 'admin',
        },
      }),
    ).toBe('El agente actualizo permisos operativos de admin en admin console.');
  });

  it('marks production configuration changes explicitly', () => {
    expect(
      service.generate({
        eventType: 'deploy_config_changed',
        source: 'github',
        sourceApp: 'actions',
        technicalSummary: null,
        metadata: {
          environment: 'production',
        },
      }),
    ).toBe('El agente cambio configuracion operativa en produccion desde actions.');
  });

  it('avoids echoing raw sensitive technical details', () => {
    expect(
      service.generate({
        eventType: 'secret_rotated',
        source: 'vault',
        sourceApp: 'vault',
        technicalSummary: 'Rotated api_key sk_live_secret_value for integration user',
        metadata: {},
      }),
    ).toBe('El agente ejecuto una operacion tecnica sensible en vault.');
  });

  it('uses technical summary as fallback when it is safe', () => {
    expect(
      service.generate({
        eventType: 'contact_review_completed',
        source: 'hubspot',
        sourceApp: 'crm',
        technicalSummary: 'Sync completed for 15 CRM records',
        metadata: {},
      }),
    ).toBe('Sync completed for 15 CRM records.');
  });
});
