import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DailyNotesProps {
  date: string;
}

export const DailyNotes = ({ date }: DailyNotesProps) => {
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Here you could save the notes to your database if needed
    setIsEditing(false);
    toast.success("Notes saved successfully");
  };

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
            <Button variant="outline" onClick={() => setIsEditing(false)}>
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