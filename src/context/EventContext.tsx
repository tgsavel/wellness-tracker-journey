import { createContext, useState, ReactNode } from "react";
import { HealthEvent, EventType, EventCategory } from "@/types/health";

interface EventContextType {
  events: HealthEvent[];
  setEvents: (events: HealthEvent[]) => void;
  eventTypes: EventType[];
  setEventTypes: (types: EventType[]) => void;
  categories: EventCategory[];
  setCategories: (categories: EventCategory[]) => void;
}

export const EventContext = createContext<EventContextType>({
  events: [],
  setEvents: () => {},
  eventTypes: [],
  setEventTypes: () => {},
  categories: [],
  setCategories: () => {},
});

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([
    { id: "1", name: "Bathroom" },
  ]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([
    { id: "1", name: "Bathroom Visit #1", categoryId: "1" },
    { id: "2", name: "Bathroom Visit #2", categoryId: "1" },
  ]);

  return (
    <EventContext.Provider 
      value={{ 
        events, 
        setEvents, 
        eventTypes, 
        setEventTypes, 
        categories, 
        setCategories 
      }}
    >
      {children}
    </EventContext.Provider>
  );
};