import { createContext, useState, ReactNode, useEffect } from "react";
import { Event, EventType, EventCategory } from "@/types/health";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EventContextType {
  events: Event[];
  setEvents: (events: Event[]) => void;
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
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch categories
          const { data: categoriesData, error: categoriesError } = await supabase
            .from('categories')
            .select('*')
            .eq('user_id', session.user.id);
          
          if (categoriesError) throw categoriesError;
          setCategories(categoriesData || []);

          // Fetch event types
          const { data: eventTypesData, error: eventTypesError } = await supabase
            .from('event_types')
            .select('*')
            .eq('user_id', session.user.id);
          
          if (eventTypesError) throw eventTypesError;
          setEventTypes(eventTypesData || []);

          // Fetch events
          const { data: eventsData, error: eventsError } = await supabase
            .from('events')
            .select('*')
            .eq('user_id', session.user.id);
          
          if (eventsError) throw eventsError;
          setEvents(eventsData || []);
        }
      } catch (error: any) {
        toast.error("Error fetching data: " + error.message);
      }
    };

    fetchData();

    // Subscribe to realtime changes
    const eventsSubscription = supabase
      .channel('events-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'events' 
      }, payload => {
        if (payload.eventType === 'INSERT') {
          setEvents(current => [...current, payload.new as Event]);
        } else if (payload.eventType === 'DELETE') {
          setEvents(current => current.filter(event => event.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setEvents(current => current.map(event => 
            event.id === payload.new.id ? payload.new as Event : event
          ));
        }
      })
      .subscribe();

    return () => {
      eventsSubscription.unsubscribe();
    };
  }, []);

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