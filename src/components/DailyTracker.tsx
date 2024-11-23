import { useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { EventContext } from "@/context/EventContext";
import { format } from "date-fns";

const categoryColors: { [key: string]: string } = {
  "Bathroom": "bg-green-700",
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
  const [notes, setNotes] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  const addEvent = () => {
    if (!selectedType) {
      toast.error("Please select an event type");
      return;
    }

    const newEvent = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
      type: selectedType,
      notes,
      timestamp: new Date().toISOString(),
    };

    setEvents([...events, newEvent]);
    setNotes("");
    setShowForm(false);
    setSelectedType("");
    setSelectedCategory("");
    toast.success("Event added successfully");
  };

  const getCategoryNameForEventType = (eventTypeName: string) => {
    const eventType = eventTypes.find(type => type.name === eventTypeName);
    if (eventType) {
      const category = categories.find(cat => cat.id === eventType.categoryId);
      return category ? category.name : "";
    }
    return "";
  };

  const getTodaysCategorySummary = () => {
    const today = new Date().toISOString().split("T")[0];
    const todaysEvents = events.filter(event => event.date === today);
    
    const categorySummary: Record<string, number> = {};
    
    todaysEvents.forEach(event => {
      const categoryName = getCategoryNameForEventType(event.type);
      if (categoryName) {
        categorySummary[categoryName] = (categorySummary[categoryName] || 0) + 1;
      }
    });
    
    return categorySummary;
  };

  const formattedDate = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Daily Health Tracker</CardTitle>
          <Button onClick={() => setShowForm(true)}>Add Event</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <div className="space-y-4 animate-fade-in">
            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select event category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCategory && (
              <Select onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes
                    .filter((type) => type.categoryId === selectedCategory)
                    .map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}

            <Input
              placeholder="Add notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setShowForm(false);
                setSelectedType("");
                setSelectedCategory("");
                setNotes("");
              }}>
                Cancel
              </Button>
              <Button onClick={addEvent}>Save Event</Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            Today's Events
            <span className="text-muted-foreground font-semibold text-lg">
              {formattedDate}
            </span>
          </h3>
          
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

          {events
            .filter(event => event.date === new Date().toISOString().split("T")[0])
            .map((event) => {
              const categoryName = getCategoryNameForEventType(event.type);
              return (
                <div
                  key={event.id}
                  className={`p-3 rounded-md flex justify-between items-center ${categoryColors[categoryName] || 'bg-gray-100'}`}
                >
                  <div>
                    <p className="font-medium">
                      {categoryName}: {event.type}
                    </p>
                    {event.notes && (
                      <p className="text-sm text-gray-600">{event.notes}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              )
            })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTracker;