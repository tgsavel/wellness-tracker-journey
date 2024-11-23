import { useContext, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventContext } from "@/context/EventContext";
import { format, addMonths } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DayEventsDialog } from "./calendar/DayEventsDialog";

const MonthlyCalendar = () => {
  const { events, categories, eventTypes } = useContext(EventContext);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDayEvents = (date: Date) => {
    const dayStr = format(date, "yyyy-MM-dd");
    return events.filter(event => event.date === dayStr);
  };

  const getDaySummary = (date: Date) => {
    const dayEvents = getDayEvents(date);
    const summary: Record<string, number> = {};
    
    categories.forEach(category => {
      const categoryEvents = dayEvents.filter(event => {
        const eventType = eventTypes.find(type => type.name === event.type);
        return eventType?.categoryId === category.id;
      });
      if (categoryEvents.length > 0) {
        summary[category.name] = categoryEvents.length;
      }
    });
    
    return summary;
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const renderCalendar = (month: Date) => (
    <div className="w-full">
      <TooltipProvider>
        <Calendar
          mode="single"
          selected={currentMonth}
          month={month}
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
                          {Object.entries(summary).map(([category]) => (
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
    </div>
  );

  return (
    <>
      <Card className="w-full max-w-5xl mx-auto mt-8 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Monthly Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderCalendar(currentMonth)}
            <div className="hidden lg:block">
              {renderCalendar(addMonths(currentMonth, 1))}
            </div>
          </div>
        </CardContent>
      </Card>

      <DayEventsDialog
        selectedDate={selectedDate}
        onOpenChange={(open) => !open && setSelectedDate(null)}
        events={events}
        eventTypes={eventTypes}
        categories={categories}
        getDayEvents={getDayEvents}
        getDaySummary={getDaySummary}
      />
    </>
  );
};

export default MonthlyCalendar;