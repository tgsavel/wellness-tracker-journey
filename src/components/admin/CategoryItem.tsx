import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EventCategory, EventType } from "@/types/health";
import { Input } from "@/components/ui/input";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EventTypeList } from "./EventTypeList";
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

interface CategoryItemProps {
  category: EventCategory;
  eventTypes: EventType[];
  onRemoveCategory: (categoryId: string) => void;
  onAddEventType: (categoryId: string, name: string) => void;
  onRemoveEventType: (eventTypeId: string) => void;
  onUpdateCategory: (categoryId: string, newName: string) => void;
  onUpdateEventType: (eventTypeId: string, newName: string) => void;
}

export const CategoryItem = ({
  category,
  eventTypes,
  onRemoveCategory,
  onAddEventType,
  onRemoveEventType,
  onUpdateCategory,
  onUpdateEventType,
}: CategoryItemProps) => {
  const [newEventName, setNewEventName] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);

  const handleAddEventType = () => {
    onAddEventType(category.id, newEventName);
    setNewEventName("");
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleEditSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (editedName.trim() !== category.name) {
      onUpdateCategory(category.id, editedName.trim());
    }
    setIsEditing(false);
  };

  return (
    <AccordionItem key={category.id} value={category.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex justify-between items-center w-full pr-4">
          {isEditing ? (
            <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-48"
              />
              <Button size="sm" onClick={handleEditSave}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => {
                setIsEditing(false);
                setEditedName(category.name);
              }}>Cancel</Button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <span>{category.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
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
            onUpdateEventType={onUpdateEventType}
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