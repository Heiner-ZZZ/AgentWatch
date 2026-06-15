import { EventModel } from './event.model';

export type TimelineEventModel = EventModel & {
  agentName: string | null;
  displaySummary: string;
};
