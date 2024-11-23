import { createContext, useState, ReactNode, useEffect } from "react";
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
  const [events, setEvents] = useState<HealthEvent[]>(() => {
    const saved = localStorage.getItem('health-events');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<EventCategory[]>(() => {
    const saved = localStorage.getItem('health-categories');
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Bathroom" },
    ];
  });

  const [eventTypes, setEventTypes] = useState<EventType[]>(() => {
    const saved = localStorage.getItem('health-event-types');
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Bathroom Visit #1", categoryId: "1" },
      { id: "2", name: "Bathroom Visit #2", categoryId: "1" },
    ];
  });

  // Persist events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('health-events', JSON.stringify(events));
  }, [events]);

  // Persist categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('health-categories', JSON.stringify(categories));
  }, [categories]);

  // Persist event types to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('health-event-types', JSON.stringify(eventTypes));
  }, [eventTypes]);

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