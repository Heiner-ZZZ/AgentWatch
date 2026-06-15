import type { DashboardTimelineEvent } from "@/features/dashboard/models/dashboard-timeline.model";

export type DashboardStatTone = "low" | "medium" | "high";

export type DashboardStat = {
  label: string;
  value: string;
  tone: DashboardStatTone;
};

export type DashboardOverview = {
  organizationName: string | null;
  organizationId: string | null;
  stats: DashboardStat[];
  filters: string[];
  events: DashboardTimelineEvent[];
  featuredEvent: DashboardTimelineEvent | null;
  connectionState: "live" | "empty" | "error";
  message: string | null;
  lastUpdatedLabel: string | null;
};
