import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

interface TaskItemProps {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: Date;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({
  id,
  title,
  description,
  completed,
  completedAt,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <div
      className={`group flex items-start gap-4 rounded-md border bg-card p-4 transition-all hover-elevate ${
        completed ? "opacity-60" : ""
      }`}
      data-testid={`task-item-${id}`}
    >
      <Checkbox
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className="mt-1"
        data-testid={`checkbox-task-${id}`}
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-base font-medium ${
            completed ? "line-through text-muted-foreground" : "text-foreground"
          }`}
          data-testid={`text-task-title-${id}`}
        >
          {title}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground mt-1" data-testid={`text-task-description-${id}`}>
            {description}
          </p>
        )}
        {completed && completedAt && (
          <p className="text-xs text-muted-foreground mt-2" data-testid={`text-completed-time-${id}`}>
            Completed {format(completedAt, "h:mm a")}
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        data-testid={`button-delete-${id}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
