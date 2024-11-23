import DailyTracker from "@/components/DailyTracker";
import WeeklySummary from "@/components/WeeklySummary";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sun, Mountain, Stethoscope } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Sun className="w-8 h-8 text-yellow-500 animate-pulse" />
            <Mountain className="w-8 h-8 text-blue-500 absolute left-4" />
            <Stethoscope className="w-8 h-8 text-green-500 ml-6" />
          </div>
          <h1 className="text-4xl font-bold text-primary ml-4">Health Event Tracker</h1>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin")}>
          Admin Settings
        </Button>
      </div>
      <DailyTracker />
      <WeeklySummary />
      <MonthlyCalendar />
    </div>
  );
};

export default Index;