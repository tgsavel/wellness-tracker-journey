import { useContext, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventContext } from "@/context/EventContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const MonthlyCalendar = () => {
  const { events, categories, eventTypes } = useContext(EventContext);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

  const getCategoryNameForEventType = (eventTypeName: string) => {
    const eventType = eventTypes.find(type => type.name === eventTypeName);
    if (eventType) {
      const category = categories.find(cat => cat.id === eventType.categoryId);
      return category ? category.name : "";
    }
    return "";
  };

  return (
    <>
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

      <Dialog open={selectedDate !== null} onOpenChange={() => setSelectedDate(null)}>
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
    </>
  );
};

export default MonthlyCalendar;