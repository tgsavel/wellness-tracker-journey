import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventType, Category, Event } from "@/types/health";

interface DayEventsDialogProps {
  selectedDate: Date | null;
  onOpenChange: (open: boolean) => void;
  events: Event[];
  eventTypes: EventType[];
  categories: Category[];
  getDayEvents: (date: Date) => Event[];
  getDaySummary: (date: Date) => Record<string, number>;
}

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

export const DayEventsDialog = ({
  selectedDate,
  onOpenChange,
  events,
  eventTypes,
  categories,
  getDayEvents,
  getDaySummary,
}: DayEventsDialogProps) => {
  const navigate = useNavigate();

  const getCategoryNameForEventType = (eventTypeName: string) => {
    const eventType = eventTypes.find(type => type.name === eventTypeName);
    if (eventType) {
      const category = categories.find(cat => cat.id === eventType.categoryid);
      return category ? category.name : "";
    }
    return "";
  };

  return (
    <Dialog open={selectedDate !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Events for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
          </DialogTitle>
        </DialogHeader>
        {selectedDate && (
          <div className="space-y-4">
            <div className="mb-4 p-4 bg-secondary/50 rounded-lg">
              <h4 className="font-medium mb-2">Category Summary:</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(getDaySummary(selectedDate)).map(([category, count]) => (
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

            {getDayEvents(selectedDate).map((event) => {
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
              );
            })}

            {getDayEvents(selectedDate).length === 0 && (
              <p className="text-center text-gray-500">No events for this day</p>
            )}

            <div className="flex justify-end">
              <Button 
                onClick={() => navigate(`/day/${format(selectedDate, 'yyyy-MM-dd')}`)}
              >
                View Full Day
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};