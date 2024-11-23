import AdminSettings from "@/components/AdminSettings";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

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