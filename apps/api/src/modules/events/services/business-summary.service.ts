import { Injectable } from '@nestjs/common';

@Injectable()
export class BusinessSummaryService {
  generate(input: {
    eventType: string;
    source: string;
    sourceApp: string | null;
    technicalSummary: string | null;
    metadata: Record<string, unknown>;
  }) {
    const channel = this.humanize(input.sourceApp ?? input.source);
    const eventType = input.eventType;
    const recipientCount = this.readCount(input.metadata, 'recipient_count');
    const recordCount = this.readCount(input.metadata, 'record_count');
    const productionTarget = this.readText(input.metadata, 'environment') === 'production';
    const permissionScope = this.readText(input.metadata, 'permission_scope');

    if (eventType.includes('email_sent') || eventType.includes('message_sent')) {
      if (recipientCount) {
        return `El agente envio ${recipientCount} mensajes desde ${channel}.`;
      }

      return `El agente envio un mensaje desde ${channel}.`;
    }

    if (eventType.includes('file_exported') || eventType.includes('data_export')) {
      if (recordCount) {
        return `El agente exporto ${recordCount} registros desde ${channel}.`;
      }

      return `El agente exporto informacion desde ${channel}.`;
    }

    if (eventType.includes('records_synced') || eventType.includes('sync')) {
      if (recordCount) {
        return `El agente sincronizo ${recordCount} registros en ${channel}.`;
      }

      return `El agente sincronizo informacion en ${channel}.`;
    }

    if (this.isDeletionEvent(eventType)) {
      if (recordCount) {
        return `El agente elimino ${recordCount} registros en ${channel}.`;
      }

      return `El agente elimino informacion en ${channel}.`;
    }

    if (this.isPermissionEvent(eventType)) {
      if (permissionScope) {
        return `El agente actualizo permisos operativos de ${permissionScope} en ${channel}.`;
      }

      return `El agente actualizo permisos operativos en ${channel}.`;
    }

    if (eventType.includes('deploy') || eventType.includes('config')) {
      if (productionTarget) {
        return `El agente cambio configuracion operativa en produccion desde ${channel}.`;
      }

      return `El agente cambio configuracion operativa en ${channel}.`;
    }

    if (input.technicalSummary?.trim()) {
      const technicalSummary = input.technicalSummary.trim();

      if (this.containsSensitiveText(technicalSummary)) {
        return `El agente ejecuto una operacion tecnica sensible en ${channel}.`;
      }

      return this.toSentence(this.limitLength(technicalSummary, 160));
    }

    return `El agente registro actividad de ${this.humanize(eventType)} en ${channel}.`;
  }

  private readCount(metadata: Record<string, unknown>, key: string) {
    const value = metadata[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private isDeletionEvent(eventType: string) {
    return ['delete', 'deleted', 'remove', 'removed', 'purge', 'drop'].some((keyword) =>
      eventType.includes(keyword),
    );
  }

  private isPermissionEvent(eventType: string) {
    return ['permission', 'permissions', 'role', 'roles', 'grant', 'revoke', 'access'].some(
      (keyword) => eventType.includes(keyword),
    );
  }

  private containsSensitiveText(value: string) {
    return [
      /api[_ -]?key/i,
      /access[_ -]?token/i,
      /refresh[_ -]?token/i,
      /\bsecret\b/i,
      /\bpassword\b/i,
      /\bcredential\b/i,
      /\bbearer\s+[a-z0-9._-]+/i,
      /\bsk_[a-z0-9_-]{6,}\b/i,
      /\bpk_[a-z0-9_-]{6,}\b/i,
    ].some((pattern) => pattern.test(value));
  }

  private readText(metadata: Record<string, unknown>, key: string) {
    const value = metadata[key];
    return typeof value === 'string' ? value.trim().toLowerCase() : null;
  }

  private humanize(value: string) {
    return value.replace(/[_-]+/g, ' ').trim().toLowerCase();
  }

  private limitLength(value: string, maxLength: number) {
    if (value.length <= maxLength) {
      return value;
    }

    return `${value.slice(0, maxLength - 1).trimEnd()}…`;
  }

  private toSentence(value: string) {
    if (/[.!?]$/.test(value)) {
      return value;
    }

    return `${value}.`;
  }
}
