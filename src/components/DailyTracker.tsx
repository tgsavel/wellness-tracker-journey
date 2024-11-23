import { useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { EventContext } from "@/context/EventContext";

const DailyTracker = () => {
  const { events, setEvents, eventTypes } = useContext(EventContext);
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
                {[...new Set(eventTypes.map(type => type.categoryId))].map(categoryId => (
                  <SelectItem key={categoryId} value={categoryId}>
                    {categoryId}
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
          <h3 className="font-semibold">Today's Events</h3>
          {events
            .filter(event => event.date === new Date().toISOString().split("T")[0])
            .map((event) => (
              <div
                key={event.id}
                className="p-3 bg-accent rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{event.type}</p>
                  {event.notes && (
                    <p className="text-sm text-gray-600">{event.notes}</p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTracker;