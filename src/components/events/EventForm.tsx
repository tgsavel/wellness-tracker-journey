import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Event, EventType, EventCategory } from "@/types/health";

interface EventFormProps {
  event?: Event;
  categories: EventCategory[];
  eventTypes: EventType[];
  onSave: (event: Partial<Event>) => void;
  onCancel: () => void;
}

export const EventForm = ({
  event,
  categories,
  eventTypes,
  onSave,
  onCancel,
}: EventFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (event) {
      const eventType = eventTypes.find(type => type.name === event.type);
      if (eventType) {
        setSelectedCategory(eventType.categoryid);
        setSelectedType(event.type);
      }
      setNotes(event.notes || "");
    }
  }, [event, eventTypes]);

  const handleSave = () => {
    if (!selectedType) {
      return;
    }

    onSave({
      ...event,
      type: selectedType,
      notes,
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes
              .filter((type) => type.categoryid === selectedCategory)
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
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Event</Button>
      </div>
    </div>
  );
};