import { Event, EventType, EventCategory } from "@/types/health";
import { EventActions } from "./EventActions";

interface EventListProps {
  events: Event[];
  eventTypes: EventType[];
  categories: EventCategory[];
  categoryColors: Record<string, string>;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const EventList = ({
  events,
  eventTypes,
  categories,
  categoryColors,
  onEditEvent,
  onDeleteEvent,
}: EventListProps) => {
  const getCategoryNameForEventType = (eventTypeName: string) => {
    const eventType = eventTypes.find(type => type.name === eventTypeName);
    if (eventType) {
      const category = categories.find(cat => cat.id === eventType.categoryid);
      return category ? category.name : "";
    }
    return "";
  };

  return (
    <div className="space-y-2">
      {events.map((event) => {
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
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
              <EventActions
                event={event}
                onEdit={onEditEvent}
                onDelete={onDeleteEvent}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};