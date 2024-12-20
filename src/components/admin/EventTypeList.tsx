import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EventType } from "@/types/health";
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
}

export const EventTypeList = ({ eventTypes, onRemoveEventType }: EventTypeListProps) => {
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {eventTypes.map((type) => (
        <div
          key={type.id}
          className="p-3 bg-accent rounded-md flex justify-between items-center"
        >
          <span className="font-medium">{type.name}</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setEventToDelete(type.id);
            }}
          >
            Remove
          </Button>
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