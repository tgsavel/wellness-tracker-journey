import { useContext, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventContext } from "@/context/EventContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MonthlyCalendar = () => {
  const { events, categories, eventTypes } = useContext(EventContext);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const navigate = useNavigate();

  const getDayEvents = (date: Date) => {
    const dayStr = format(date, "yyyy-MM-dd");
    return events.filter(event => event.date === dayStr);
  };

  const getDaySummary = (date: Date) => {
    const dayEvents = getDayEvents(date);
    const summary: Record<string, number> = {};
    
    categories.forEach(category => {
      const categoryEvents = dayEvents.filter(event => {
        // Find the event type that matches this event
        const eventType = eventTypes.find(type => type.name === event.type);
        // Check if this event type belongs to the current category
        return eventType?.categoryId === category.id;
      });
      if (categoryEvents.length > 0) {
        summary[category.name] = categoryEvents.length;
      }
    });
    
    return summary;
  };

  const handleDayClick = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    // Here we could navigate to a new route with the date as a parameter
    // For now, we'll just show the events in a toast
    const dayEvents = getDayEvents(date);
    if (dayEvents.length > 0) {
      navigate(`/day/${formattedDate}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            Monthly Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const prevMonth = new Date(currentMonth);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                setCurrentMonth(prevMonth);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const nextMonth = new Date(currentMonth);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setCurrentMonth(nextMonth);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Calendar
            mode="single"
            selected={currentMonth}
            month={currentMonth}
            onDayClick={handleDayClick}
            modifiers={{
              hasEvents: (date) => getDayEvents(date).length > 0,
            }}
            modifiersStyles={{
              hasEvents: { backgroundColor: "var(--accent)" },
            }}
            components={{
              DayContent: ({ date }) => {
                const summary = getDaySummary(date);
                const hasEvents = Object.keys(summary).length > 0;

                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <span>{date.getDate()}</span>
                        {hasEvents && (
                          <div className="flex gap-1 mt-1">
                            {Object.entries(summary).map(([category, count]) => (
                              <div
                                key={category}
                                className="w-2 h-2 rounded-full bg-primary"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    {hasEvents && (
                      <TooltipContent>
                        <div className="space-y-1">
                          {Object.entries(summary).map(([category, count]) => (
                            <div key={category} className="flex justify-between gap-2">
                              <span>{category}:</span>
                              <span className="font-medium">{count}</span>
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              },
            }}
          />
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default MonthlyCalendar;