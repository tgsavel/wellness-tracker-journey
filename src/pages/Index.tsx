import { useEffect, useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import Auth from "@/components/Auth";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUsername(session.user.id);
      }
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUsername(session.user.id);
      }
    });
  }, []);

  const fetchUsername = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching username:', error);
        return;
      }
      
      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="relative flex items-center">
            <Sun className="w-8 h-8 text-yellow-500 animate-pulse" />
            <Mountain className="w-8 h-8 text-blue-500 absolute left-4" />
            <Stethoscope className="w-8 h-8 text-green-500 ml-6" />
          </div>
          <h1 className="text-2xl font-bold text-primary ml-4">Health Event Tracker</h1>
        </div>
        <Auth />
      </div>
    );
  }

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
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {username}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => navigate("/admin")}>
                Admin Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {
                supabase.auth.signOut();
                toast.success("Signed out successfully");
              }}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <DailyTracker />
      <WeeklySummary />
      <MonthlyCalendar />
    </div>
  );
};

export default Index;