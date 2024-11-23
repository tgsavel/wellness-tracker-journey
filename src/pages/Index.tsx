import DailyTracker from "@/components/DailyTracker";
import WeeklySummary from "@/components/WeeklySummary";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">Health Event Tracker</h1>
        <Button variant="outline" onClick={() => navigate("/admin")}>
          Admin Settings
        </Button>
      </div>
      <DailyTracker />
      <WeeklySummary />
    </div>
  );
};

export default Index;