import { format } from "date-fns";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import TaskItem from "@/components/TaskItem";
import AddTaskForm from "@/components/AddTaskForm";
import StatCard from "@/components/StatCard";
import { CheckCircle2, Flame, Calendar as CalendarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";

export default function Today() {
  const { toast } = useToast();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks", today],
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: { title: string; description?: string }) => {
      return apiRequest("POST", `/api/tasks`, {
        title: data.title,
        description: data.description,
        date: today,
        completed: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", today] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      return apiRequest("PATCH", `/api/tasks/${id}`, {
        completed,
        completedAt: completed ? new Date().toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", today] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", today] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const handleToggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      updateTaskMutation.mutate({ id, completed: !task.completed });
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleAddTask = (title: string, description?: string) => {
    createTaskMutation.mutate({ title, description });
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

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
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          {format(new Date(), "EEEE, MMMM d")}
        </h1>
        <p className="text-muted-foreground mt-1" data-testid="text-page-subtitle">
          Stay consistent, build momentum
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              title="Completed Today"
              value={`${completedTasks.length}/${tasks.length}`}
              description={`${completionRate}% completion rate`}
              icon={CheckCircle2}
            />
            <StatCard
              title="Current Streak"
              value="7 days"
              description="Keep it going!"
              icon={Flame}
            />
            <StatCard
              title="This Week"
              value="85%"
              description="Average completion"
              icon={CalendarIcon}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4" data-testid="text-section-title-active">
              Active Tasks ({activeTasks.length})
            </h2>
            <div className="space-y-3">
              {activeTasks.length > 0 ? (
                activeTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description ?? undefined}
                    completed={task.completed}
                    completedAt={task.completedAt ? new Date(task.completedAt) : undefined}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground" data-testid="text-empty-state">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>All tasks completed! Great work!</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <AddTaskForm onAdd={handleAddTask} />
          </div>

          {completedTasks.length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-4" data-testid="text-section-title-completed">
                  Completed ({completedTasks.length})
                </h2>
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description ?? undefined}
                      completed={task.completed}
                      completedAt={task.completedAt ? new Date(task.completedAt) : undefined}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
