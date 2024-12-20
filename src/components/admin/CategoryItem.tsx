import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EventCategory, EventType } from "@/types/health";
import { Input } from "@/components/ui/input";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EventTypeList } from "./EventTypeList";
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

interface CategoryItemProps {
  category: EventCategory;
  eventTypes: EventType[];
  onRemoveCategory: (categoryId: string) => void;
  onAddEventType: (categoryId: string, name: string) => void;
  onRemoveEventType: (eventTypeId: string) => void;
}

export const CategoryItem = ({
  category,
  eventTypes,
  onRemoveCategory,
  onAddEventType,
  onRemoveEventType,
}: CategoryItemProps) => {
  const [newEventName, setNewEventName] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAddEventType = () => {
    onAddEventType(category.id, newEventName);
    setNewEventName("");
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  return (
    <AccordionItem key={category.id} value={category.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex justify-between items-center w-full pr-4">
          <span>{category.name}</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRemoveClick}
          >
            Remove Category
          </Button>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-4">
          <div className="flex gap-2">
            <Input
              placeholder="New event type name"
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
            />
            <Button onClick={handleAddEventType}>Add Event Type</Button>
          </div>
          <EventTypeList
            eventTypes={eventTypes.filter((type) => type.categoryid === category.id)}
            onRemoveEventType={onRemoveEventType}
          />
        </div>
      </AccordionContent>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
                onRemoveCategory(category.id);
                setIsDeleteDialogOpen(false);
              }}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AccordionItem>
  );
};