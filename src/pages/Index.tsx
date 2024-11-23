import DailyTracker from "@/components/DailyTracker";
import WeeklySummary from "@/components/WeeklySummary";
import AdminSettings from "@/components/AdminSettings";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Health Event Tracker
      </h1>
      <DailyTracker />
      <WeeklySummary />
      <AdminSettings />
    </div>
  );
};

export default Index;