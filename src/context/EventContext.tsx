import { createContext, useState, ReactNode } from "react";
import { HealthEvent, EventType } from "@/types/health";

interface EventContextType {
  events: HealthEvent[];
  setEvents: (events: HealthEvent[]) => void;
  eventTypes: EventType[];
  setEventTypes: (types: EventType[]) => void;
}

export const EventContext = createContext<EventContextType>({
  events: [],
  setEvents: () => {},
  eventTypes: [],
  setEventTypes: () => {},
});

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([
    { id: "1", name: "Bathroom Visit #1", category: "bathroom" },
    { id: "2", name: "Bathroom Visit #2", category: "bathroom" },
  ]);

  return (
    <EventContext.Provider value={{ events, setEvents, eventTypes, setEventTypes }}>
      {children}
    </EventContext.Provider>
  );
};