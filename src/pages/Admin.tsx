import { useEffect, useState } from "react";
import AdminSettings from "@/components/AdminSettings";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Auth from "@/components/Auth";

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center justify-center">
        <Auth />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">Admin Settings</h1>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to Tracker
        </Button>
      </div>
      <AdminSettings />
    </div>
  );
};

export default Admin;