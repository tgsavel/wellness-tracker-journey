import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeeklySummary as WeeklySummaryType } from "@/types/health";
import { useContext, useState } from "react";
import { EventContext } from "@/context/EventContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, endOfWeek, addWeeks, parseISO } from "date-fns";

const WeeklySummary = () => {
  const { events, eventTypes, categories } = useContext(EventContext);
  const [weekOffset, setWeekOffset] = useState(0);

  // Calculate dates for the selected week
  const getWeekDates = (offset: number) => {
    const today = new Date();
    const start = startOfWeek(addWeeks(today, offset), { weekStartsOn: 0 });
    const end = endOfWeek(addWeeks(today, offset), { weekStartsOn: 0 });
    return { startOfWeek: start, endOfWeek: end };
  };

  const { startOfWeek: weekStart, endOfWeek: weekEnd } = getWeekDates(weekOffset);

  const weeklyEvents = events.filter(event => {
    const eventDate = parseISO(event.date);
    return eventDate >= weekStart && eventDate <= weekEnd;
  });

  const getCategoryNameForEventType = (eventTypeName: string) => {
    const eventType = eventTypes.find(type => type.name === eventTypeName);
    if (eventType) {
      const category = categories.find(cat => cat.id === eventType.categoryid);
      return category ? category.name : "";
    }
    return "";
  };

  const getWeeklyCategorySummary = () => {
    const categorySummary: Record<string, { total: number; average: number }> = {};
    
    weeklyEvents.forEach(event => {
      const categoryName = getCategoryNameForEventType(event.type);
      if (categoryName) {
        if (!categorySummary[categoryName]) {
          categorySummary[categoryName] = { total: 0, average: 0 };
        }
        categorySummary[categoryName].total += 1;
      }
    });

    // Calculate daily averages
    Object.keys(categorySummary).forEach(category => {
      categorySummary[category].average = Number((categorySummary[category].total / 7).toFixed(1));
    });

    return categorySummary;
  };

  const summary: WeeklySummaryType = {
    startDate: format(weekStart, 'yyyy-MM-dd'),
    endDate: format(weekEnd, 'yyyy-MM-dd'),
    totalEvents: weeklyEvents.length,
    eventsByType: weeklyEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setWeekOffset(prev => prev - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-center">
            Weekly Summary
          </CardTitle>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setWeekOffset(prev => prev + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            {format(weekStart, "MMMM d, yyyy")} to {format(weekEnd, "MMMM d, yyyy")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-accent rounded-lg">
              <h3 className="font-semibold mb-2">Total Events</h3>
              <p className="text-3xl font-bold text-primary">
                {summary.totalEvents}
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">Category Summary</h3>
              {Object.entries(getWeeklyCategorySummary()).map(([category, stats]) => (
                <div key={category} className="flex flex-col space-y-1 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category}:</span>
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  <div className="text-sm text-gray-600 flex justify-between items-center">
                    <span>Daily Average:</span>
                    <span>{stats.average}</span>
                  </div>
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