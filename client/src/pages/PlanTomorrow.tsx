import { format, addDays } from "date-fns";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import AddTaskForm from "@/components/AddTaskForm";
import TaskItem from "@/components/TaskItem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";

export default function PlanTomorrow() {
  const { toast } = useToast();
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks", tomorrow],
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: { title: string; description?: string }) => {
      return apiRequest("POST", `/api/tasks`, {
        title: data.title,
        description: data.description,
        date: tomorrow,
        completed: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", tomorrow] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/range"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", tomorrow] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/range"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const handleAddTask = (title: string, description?: string) => {
    createTaskMutation.mutate({ title, description });
  };

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleCommitPlan = () => {
    toast({
      title: "Plan saved!",
      description: `${tasks.length} tasks scheduled for tomorrow.`,
    });
  };

  const tomorrowDate = addDays(new Date(), 1);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

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
          {tasks.length > 0 && (
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

          {tasks.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" data-testid="text-section-title">
                <Calendar className="h-5 w-5" />
                Tomorrow's Tasks ({tasks.length})
              </h2>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description ?? undefined}
                    completed={task.completed}
                    completedAt={task.completedAt ? new Date(task.completedAt) : undefined}
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
