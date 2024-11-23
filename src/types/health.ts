export interface HealthEvent {
  id: string;
  date: string;
  type: string;
  notes?: string;
  timestamp: string;
}

export interface EventCategory {
  id: string;
  name: string;
}

export interface EventType {
  id: string;
  name: string;
  categoryId: string;
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

// Aliases for simpler naming in components
export type Event = HealthEvent;
export type Category = EventCategory;