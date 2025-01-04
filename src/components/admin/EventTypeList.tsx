import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EventType } from "@/types/health";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EventTypeListProps {
  eventTypes: EventType[];
  onRemoveEventType: (eventTypeId: string) => void;
  onUpdateEventType: (eventTypeId: string, newName: string) => void;
}

export const EventTypeList = ({ 
  eventTypes, 
  onRemoveEventType,
  onUpdateEventType 
}: EventTypeListProps) => {
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  const handleEditSave = (eventId: string) => {
    if (editedName.trim() !== "") {
      onUpdateEventType(eventId, editedName.trim());
    }
    setEditingEventId(null);
    setEditedName("");
  };

  return (
    <div className="space-y-2">
      {eventTypes.map((type) => (
        <div
          key={type.id}
          className="p-3 bg-accent rounded-md flex justify-between items-center"
        >
          {editingEventId === type.id ? (
            <div className="flex gap-2 items-center flex-1">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={() => handleEditSave(type.id)}>
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingEventId(null);
                  setEditedName("");
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <span className="font-medium">{type.name}</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingEventId(type.id);
                    setEditedName(type.name);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setEventToDelete(type.id)}
                >
                  Remove
                </Button>
              </div>
            </>
          )}
        </div>
      ))}

      <AlertDialog
        open={!!eventToDelete}
        onOpenChange={(open) => !open && setEventToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Removal</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to remove this? It cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (eventToDelete) {
                  onRemoveEventType(eventToDelete);
                  setEventToDelete(null);
                }
              }}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};