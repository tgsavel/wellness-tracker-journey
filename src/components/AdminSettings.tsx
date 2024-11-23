import { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { EventContext } from "@/context/EventContext";
import { EventType, EventCategory } from "@/types/health";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AdminSettings = () => {
  const { eventTypes, setEventTypes, categories, setCategories } = useContext(EventContext);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newEventName, setNewEventName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const addCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const newCategory: EventCategory = {
      id: crypto.randomUUID(),
      name: newCategoryName,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    toast.success("Category added successfully");
  };

  const removeCategory = (categoryId: string) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId));
    setEventTypes(eventTypes.filter((type) => type.categoryId !== categoryId));
    toast.success("Category and its event types removed successfully");
  };

  const addEventType = (categoryId: string) => {
    if (!newEventName.trim()) {
      toast.error("Please enter an event name");
      return;
    }

    const newType: EventType = {
      id: crypto.randomUUID(),
      name: newEventName,
      categoryId: categoryId,
    };

    setEventTypes([...eventTypes, newType]);
    setNewEventName("");
    toast.success("Event type added successfully");
  };

  const removeEventType = (id: string) => {
    setEventTypes(eventTypes.filter((type) => type.id !== id));
    toast.success("Event type removed successfully");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Admin Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button onClick={addCategory}>Add Category</Button>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {categories.map((category) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between items-center w-full pr-4">
                  <span>{category.name}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCategory(category.id);
                    }}
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
                    <Button onClick={() => addEventType(category.id)}>
                      Add Event Type
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {eventTypes
                      .filter((type) => type.categoryId === category.id)
                      .map((type) => (
                        <div
                          key={type.id}
                          className="p-3 bg-accent rounded-md flex justify-between items-center"
                        >
                          <span className="font-medium">{type.name}</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeEventType(type.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;