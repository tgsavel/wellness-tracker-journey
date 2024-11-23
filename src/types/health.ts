export interface HealthEvent {
  id: string;
  date: string;
  type: string;
  notes?: string;
  timestamp: string;
}

export interface EventType {
  id: string;
  name: string;
  category: "bathroom" | "other";
}

export interface DailySummary {
  date: string;
  events: HealthEvent[];
}

export interface WeeklySummary {
  startDate: string;
  endDate: string;
  totalEvents: number;
  eventsByType: Record<string, number>;
}