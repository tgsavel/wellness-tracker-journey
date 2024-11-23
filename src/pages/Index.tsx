import DailyTracker from "@/components/DailyTracker";
import WeeklySummary from "@/components/WeeklySummary";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import { useNavigate } from "react-router-dom";
import { Settings, Sun, Mountain, Stethoscope } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    toast.info("Login functionality will be implemented soon");
  };

  const handleLogout = () => {
    toast.info("Logout functionality will be implemented soon");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Sun className="w-8 h-8 text-yellow-500 animate-pulse" />
            <Mountain className="w-8 h-8 text-blue-500 absolute left-4" />
            <Stethoscope className="w-8 h-8 text-green-500 ml-6" />
          </div>
          <h1 className="text-2xl font-bold text-primary ml-4">Health Event Tracker</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={handleLogin}>
              Login
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleLogout}>
              Logout
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate("/admin")}>
              Admin Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DailyTracker />
      <WeeklySummary />
      <MonthlyCalendar />
    </div>
  );
};

export default Index;