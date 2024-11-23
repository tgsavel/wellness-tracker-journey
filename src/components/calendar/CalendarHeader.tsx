import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="font-medium">
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={onNextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};