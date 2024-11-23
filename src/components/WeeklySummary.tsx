import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklySummary as WeeklySummaryType } from "@/types/health";

const WeeklySummary = () => {
  // This would normally come from your backend
  const mockSummary: WeeklySummaryType = {
    startDate: "2024-03-18",
    endDate: "2024-03-24",
    totalEvents: 14,
    eventsByType: {
      "Bathroom Visit #1": 8,
      "Bathroom Visit #2": 6,
    },
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
            {mockSummary.startDate} to {mockSummary.endDate}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-accent rounded-lg">
              <h3 className="font-semibold mb-2">Total Events</h3>
              <p className="text-3xl font-bold text-primary">
                {mockSummary.totalEvents}
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">Events by Type</h3>
              {Object.entries(mockSummary.eventsByType).map(([type, count]) => (
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