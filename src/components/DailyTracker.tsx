import { useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EventContext } from "@/context/EventContext";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Event } from "@/types/health";
import { EventForm } from "./events/EventForm";
import { EventList } from "./events/EventList";
import { CategorySummary } from "./daily/CategorySummary";
import { DailyNotes } from "./daily/DailyNotes";
import { supabase } from "@/integrations/supabase/client";

const categoryColors: { [key: string]: string } = {
  "Bathroom": "bg-green-100",
  "Exercise": "bg-green-100",
  "Medication": "bg-purple-100",
  "Food": "bg-yellow-100",
  "Sleep": "bg-indigo-100",
  "Mood": "bg-pink-100",
  "Pain": "bg-red-100",
  "Symptom": "bg-orange-100",
  "Other": "bg-gray-100"
};

const DailyTracker = () => {
  const { events, setEvents, eventTypes, categories } = useContext(EventContext);
  const [showForm, setShowForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handlePreviousDay = () => {
    setCurrentDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setCurrentDate(prev => addDays(prev, 1));
  };

  const handleSaveEvent = async (eventData: Partial<Event>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update({
            type: eventData.type,
            notes: eventData.notes,
            date: format(currentDate, 'yyyy-MM-dd'),
            timestamp: eventData.timestamp,
          })
          .eq('id', editingEvent.id);

        if (error) throw error;
        
        setEvents(events.map(event => 
          event.id === editingEvent.id 
            ? { ...event, ...eventData }
            : event
        ));
        setEditingEvent(null);
        toast.success("Event updated successfully");
      } else {
        const { data, error } = await supabase
          .from('events')
          .insert({
            date: format(currentDate, 'yyyy-MM-dd'),
            type: eventData.type!,
            notes: eventData.notes,
            timestamp: eventData.timestamp,
            user_id: user.id
          })
          .select()
          .single();

        if (error) throw error;
        
        setEvents([...events, data as Event]);
        toast.success("Event added successfully");
      }
      setShowForm(false);
    } catch (error: any) {
      toast.error("Error saving event: " + error.message);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(events.filter(event => event.id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error: any) {
      toast.error("Error deleting event: " + error.message);
    }
  };

  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy");
  const todaysEvents = events
    .filter(event => event.date === format(currentDate, 'yyyy-MM-dd'))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Daily Health Tracker</CardTitle>
          <Button onClick={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}>
            Add Event
          </Button>
        </div>
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousDay}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground font-semibold">
            {formattedDate}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextDay}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <EventForm
            event={editingEvent || undefined}
            categories={categories}
            eventTypes={eventTypes}
            onSave={handleSaveEvent}
            onCancel={() => {
              setShowForm(false);
              setEditingEvent(null);
            }}
          />
        )}

        <CategorySummary
          events={todaysEvents}
          eventTypes={eventTypes}
          categories={categories}
          categoryColors={categoryColors}
        />

        <DailyNotes date={formattedDate} />

        <EventList
          events={todaysEvents}
          eventTypes={eventTypes}
          categories={categories}
          categoryColors={categoryColors}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </CardContent>
    </Card>
  );
};

export default DailyTracker;