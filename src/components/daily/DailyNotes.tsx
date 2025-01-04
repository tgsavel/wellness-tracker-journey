import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface DailyNotesProps {
  date: string;
}

export const DailyNotes = ({ date }: DailyNotesProps) => {
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [date]);

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('daily_notes')
        .select('notes')
        .eq('date', format(new Date(date), 'yyyy-MM-dd'))
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      setNotes(data?.notes || "");
    } catch (error: any) {
      toast.error("Error fetching notes: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const formattedDate = format(new Date(date), 'yyyy-MM-dd');

      const { error } = await supabase
        .from('daily_notes')
        .upsert({
          date: formattedDate,
          notes,
          user_id: user.id
        }, {
          onConflict: 'user_id,date'
        });

      if (error) throw error;
      
      setIsEditing(false);
      toast.success("Notes saved successfully");
    } catch (error: any) {
      toast.error("Error saving notes: " + error.message);
    }
  };

  if (isLoading) {
    return <div className="mb-4 p-4 bg-accent/50 rounded-lg animate-pulse h-[100px]" />;
  }

  return (
    <div className="mb-4 p-4 bg-accent/50 rounded-lg">
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes for the day..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setIsEditing(false);
              fetchNotes(); // Reset to last saved state
            }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => setIsEditing(true)} 
          className="min-h-[50px] cursor-text"
        >
          {notes ? (
            <p className="text-sm">{notes}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Click to add notes for {date}...
            </p>
          )}
        </div>
      )}
    </div>
  );
};