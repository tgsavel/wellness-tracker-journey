import { EventType, EventCategory } from "@/types/health";

interface CategorySummaryProps {
  events: Array<{ type: string }>;
  eventTypes: EventType[];
  categories: EventCategory[];
  categoryColors: Record<string, string>;
}

export const CategorySummary = ({
  events,
  eventTypes,
  categories,
  categoryColors,
}: CategorySummaryProps) => {
  const getCategorySummary = () => {
    const categorySummary: Record<string, number> = {};
    
    events.forEach(event => {
      const eventType = eventTypes.find(type => type.name === event.type);
      if (eventType) {
        const category = categories.find(cat => cat.id === eventType.categoryid);
        if (category) {
          categorySummary[category.name] = (categorySummary[category.name] || 0) + 1;
        }
      }
    });
    
    return categorySummary;
  };

  return (
    <div className="mb-4 p-4 bg-secondary/50 rounded-lg">
      <h4 className="font-medium mb-2">Category Summary:</h4>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(getCategorySummary()).map(([category, count]) => (
          <div 
            key={category} 
            className={`flex justify-between items-center px-3 py-1 rounded ${categoryColors[category] || 'bg-gray-100'}`}
          >
            <span>{category}:</span>
            <span className="font-semibold">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};