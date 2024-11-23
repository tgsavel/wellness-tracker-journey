import { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { EventContext } from "@/context/EventContext";
import { useState } from "react";
import { EventType } from "@/types/health";

const AdminSettings = () => {
  const { eventTypes, setEventTypes } = useContext(EventContext);
  const [newEventName, setNewEventName] = useState("");
  const [newEventCategory, setNewEventCategory] = useState<"bathroom" | "other">("bathroom");

  const addEventType = () => {
    if (!newEventName.trim() || !newEventCategory) {
      toast.error("Please enter both event name and category");
      return;
    }

    const newType: EventType = {
      id: crypto.randomUUID(),
      name: newEventName,
      category: newEventCategory,
    };

    setEventTypes([...eventTypes, newType]);
    setNewEventName("");
    setNewEventCategory("bathroom");
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
        <div className="space-y-4">
          <Input
            placeholder="New event type name"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
          />
          <Select onValueChange={(value: "bathroom" | "other") => setNewEventCategory(value)} value={newEventCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bathroom">Bathroom</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addEventType} className="w-full">Add Event Type</Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Current Event Types</h3>
          {eventTypes.map((type) => (
            <div
              key={type.id}
              className="p-3 bg-accent rounded-md flex justify-between items-center"
            >
              <div>
                <span className="font-medium">{type.name}</span>
                <span className="ml-2 text-sm text-gray-600">({type.category})</span>
              </div>
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