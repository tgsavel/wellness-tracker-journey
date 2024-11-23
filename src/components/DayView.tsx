import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EventContext } from "@/context/EventContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";

const DayView = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const { events } = useContext(EventContext);

  const dayEvents = events.filter(event => event.date === date);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-4xl font-bold text-primary">
          Events for {format(new Date(date!), "MMMM d, yyyy")}
        </h1>
      </div>
      
      <Card className="w-full max-w-2xl mx-auto animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Daily Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-accent rounded-lg flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold">{event.type}</h3>
                  {event.notes && (
                    <p className="text-sm text-gray-600 mt-1">{event.notes}</p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {format(new Date(event.timestamp), "h:mm a")}
                </span>
              </div>
            ))}
            {dayEvents.length === 0 && (
              <p className="text-center text-gray-500">No events for this day</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DayView;