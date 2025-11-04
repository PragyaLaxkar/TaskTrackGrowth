import TaskItem from "../TaskItem";

export default function TaskItemExample() {
  return (
    <div className="space-y-4 p-6">
      <TaskItem
        id="1"
        title="Morning workout"
        description="30 minutes cardio and strength training"
        completed={false}
        onToggle={(id) => console.log("Toggle task:", id)}
        onDelete={(id) => console.log("Delete task:", id)}
      />
      <TaskItem
        id="2"
        title="Read for 30 minutes"
        completed={true}
        completedAt={new Date()}
        onToggle={(id) => console.log("Toggle task:", id)}
        onDelete={(id) => console.log("Delete task:", id)}
      />
    </div>
  );
}
