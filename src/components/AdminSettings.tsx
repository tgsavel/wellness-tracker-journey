import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { EventType } from "@/types/health";

const AdminSettings = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([
    { id: "1", name: "Bathroom Visit #1", category: "bathroom" },
    { id: "2", name: "Bathroom Visit #2", category: "bathroom" },
  ]);
  const [newEventName, setNewEventName] = useState("");

  const addEventType = () => {
    if (!newEventName.trim()) {
      toast.error("Please enter an event name");
      return;
    }

    const newType: EventType = {
      id: crypto.randomUUID(),
      name: newEventName,
      category: "bathroom",
    };

    setEventTypes([...eventTypes, newType]);
    setNewEventName("");
    toast.success("Event type added successfully");
  };

  const removeEventType = (id: string) => {
    setEventTypes(eventTypes.filter((type) => type.id !== id));
    toast.success("Event type removed successfully");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Admin Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="New event type name"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
          />
          <Button onClick={addEventType}>Add</Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Current Event Types</h3>
          {eventTypes.map((type) => (
            <div
              key={type.id}
              className="p-3 bg-accent rounded-md flex justify-between items-center"
            >
              <span>{type.name}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeEventType(type.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;