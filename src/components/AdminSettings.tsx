import { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { EventContext } from "@/context/EventContext";
import { Accordion } from "@/components/ui/accordion";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CategoryItem } from "./admin/CategoryItem";

const AdminSettings = () => {
  const { eventTypes, setEventTypes, categories, setCategories } = useContext(EventContext);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: categoriesError } = await supabase
        .from('categories')
        .upsert(
          categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            user_id: user.id
          }))
        );
      
      if (categoriesError) throw categoriesError;

      const { error: eventTypesError } = await supabase
        .from('event_types')
        .upsert(
          eventTypes.map(type => ({
            id: type.id,
            name: type.name,
            categoryid: type.categoryid,
            user_id: user.id
          }))
        );
      
      if (eventTypesError) throw eventTypesError;

      toast.success("All changes have been saved successfully!");
    } catch (error: any) {
      toast.error("Error saving changes: " + error.message);
    }
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newCategoryName,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, data]);
      setNewCategoryName("");
      toast.success("Category added successfully");
    } catch (error: any) {
      toast.error("Error adding category: " + error.message);
    }
  };

  const removeCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      setCategories(categories.filter((cat) => cat.id !== categoryId));
      setEventTypes(eventTypes.filter((type) => type.categoryid !== categoryId));
      toast.success("Category and its event types removed successfully");
    } catch (error: any) {
      toast.error("Error removing category: " + error.message);
    }
  };

  const addEventType = async (categoryId: string, name: string) => {
    if (!name.trim()) {
      toast.error("Please enter an event name");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('event_types')
        .insert({
          name: name,
          categoryid: categoryId,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setEventTypes([...eventTypes, data]);
      toast.success("Event type added successfully");
    } catch (error: any) {
      toast.error("Error adding event type: " + error.message);
    }
  };

  const removeEventType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('event_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEventTypes(eventTypes.filter((type) => type.id !== id));
      toast.success("Event type removed successfully");
    } catch (error: any) {
      toast.error("Error removing event type: " + error.message);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Admin Settings</CardTitle>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
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
            <CategoryItem
              key={category.id}
              category={category}
              eventTypes={eventTypes}
              onRemoveCategory={removeCategory}
              onAddEventType={addEventType}
              onRemoveEventType={removeEventType}
            />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;