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

    if (eventType.includes('deploy') || eventType.includes('config')) {
      return `El agente cambio configuracion operativa en ${channel}.`;
    }

    if (input.technicalSummary?.trim()) {
      return this.toSentence(input.technicalSummary.trim());
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

  private humanize(value: string) {
    return value.replace(/[_-]+/g, ' ').trim().toLowerCase();
  }

  private toSentence(value: string) {
    if (/[.!?]$/.test(value)) {
      return value;
    }

    return `${value}.`;
  }
}
