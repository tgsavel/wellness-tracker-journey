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

  const handleSaveEvent = (eventData: Partial<Event>) => {
    if (editingEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...eventData }
          : event
      ));
      setEditingEvent(null);
      toast.success("Event updated successfully");
    } else {
      // Add new event
      const newEvent: Event = {
        id: crypto.randomUUID(),
        date: format(currentDate, 'yyyy-MM-dd'),
        type: eventData.type!,
        notes: eventData.notes,
        timestamp: new Date().toISOString(),
      };
      setEvents([...events, newEvent]);
      toast.success("Event added successfully");
    }
    setShowForm(false);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy");
  const todaysEvents = events.filter(event => event.date === format(currentDate, 'yyyy-MM-dd'));

  const getTodaysCategorySummary = () => {
    const categorySummary: Record<string, number> = {};
    
    todaysEvents.forEach(event => {
      const eventType = eventTypes.find(type => type.name === event.type);
      if (eventType) {
        const category = categories.find(cat => cat.id === eventType.categoryId);
        if (category) {
          categorySummary[category.name] = (categorySummary[category.name] || 0) + 1;
        }
      }
    });
    
    return categorySummary;
  };

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

        <div className="mb-4 p-4 bg-secondary/50 rounded-lg">
          <h4 className="font-medium mb-2">Category Summary:</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(getTodaysCategorySummary()).map(([category, count]) => (
              <div 
                key={category} 
                className={`flex justify-between items-center px-3 py-1 rounded ${categoryColors[category] || 'bg-gray-100'}`}
              >
                <span>{category}:</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

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