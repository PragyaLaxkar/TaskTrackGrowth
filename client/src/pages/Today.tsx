import { useState } from "react";
import { format } from "date-fns";
import TaskItem from "@/components/TaskItem";
import AddTaskForm from "@/components/AddTaskForm";
import StatCard from "@/components/StatCard";
import { CheckCircle2, Flame, Calendar as CalendarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

//todo: remove mock functionality
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: Date;
}

export default function Today() {
  //todo: remove mock functionality
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Morning workout",
      description: "30 minutes cardio",
      completed: false,
    },
    {
      id: "2",
      title: "Read for 30 minutes",
      completed: true,
      completedAt: new Date(),
    },
    {
      id: "3",
      title: "Work on side project",
      description: "2 hours of focused work",
      completed: false,
    },
  ]);

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined,
            }
          : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleAddTask = (title: string, description?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

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
                    {...task}
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
                      {...task}
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
