import { useState } from "react";
import { format, addDays } from "date-fns";
import AddTaskForm from "@/components/AddTaskForm";
import TaskItem from "@/components/TaskItem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

//todo: remove mock functionality
interface PlannedTask {
  id: string;
  title: string;
  description?: string;
}

export default function PlanTomorrow() {
  const { toast } = useToast();
  //todo: remove mock functionality
  const [plannedTasks, setPlannedTasks] = useState<PlannedTask[]>([
    {
      id: "1",
      title: "Morning meditation",
      description: "15 minutes",
    },
    {
      id: "2",
      title: "Review weekly goals",
    },
  ]);

  const handleAddTask = (title: string, description?: string) => {
    const newTask: PlannedTask = {
      id: Date.now().toString(),
      title,
      description,
    };
    setPlannedTasks((prev) => [...prev, newTask]);
  };

  const handleDeleteTask = (id: string) => {
    setPlannedTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleCommitPlan = () => {
    toast({
      title: "Plan saved!",
      description: `${plannedTasks.length} tasks scheduled for tomorrow.`,
    });
  };

  const tomorrowDate = addDays(new Date(), 1);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-background p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="text-page-title">
              Plan Tomorrow
              <Badge variant="secondary" className="text-sm">
                {format(tomorrowDate, "MMM d")}
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1" data-testid="text-page-subtitle">
              Prepare your tasks for {format(tomorrowDate, "EEEE")}
            </p>
          </div>
          {plannedTasks.length > 0 && (
            <Button onClick={handleCommitPlan} data-testid="button-commit-plan">
              <Sparkles className="h-4 w-4 mr-2" />
              Commit Plan
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          <div>
            <AddTaskForm
              onAdd={handleAddTask}
              placeholder="What do you want to accomplish tomorrow?"
            />
          </div>

          {plannedTasks.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" data-testid="text-section-title">
                <Calendar className="h-5 w-5" />
                Tomorrow's Tasks ({plannedTasks.length})
              </h2>
              <div className="space-y-3">
                {plannedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    {...task}
                    completed={false}
                    onToggle={() => {}}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground" data-testid="text-empty-state">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No tasks planned yet</p>
              <p className="text-sm mt-2">Start adding tasks for tomorrow</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
