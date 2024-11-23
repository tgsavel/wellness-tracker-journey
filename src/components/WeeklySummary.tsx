import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklySummary as WeeklySummaryType } from "@/types/health";
import { useContext } from "react";
import { EventContext } from "@/context/EventContext";

const WeeklySummary = () => {
  const { events } = useContext(EventContext);

  // Calculate summary from actual events
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

  const weeklyEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startOfWeek && eventDate <= endOfWeek;
  });

  const summary: WeeklySummaryType = {
    startDate: startOfWeek.toISOString().split('T')[0],
    endDate: endOfWeek.toISOString().split('T')[0],
    totalEvents: weeklyEvents.length,
    eventsByType: weeklyEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Weekly Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            {summary.startDate} to {summary.endDate}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-accent rounded-lg">
              <h3 className="font-semibold mb-2">Total Events</h3>
              <p className="text-3xl font-bold text-primary">
                {summary.totalEvents}
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">Events by Type</h3>
              {Object.entries(summary.eventsByType).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span>{type}:</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySummary;