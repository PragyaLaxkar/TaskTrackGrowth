import AddTaskForm from "../AddTaskForm";

export default function AddTaskFormExample() {
  return (
    <div className="p-6 max-w-2xl">
      <AddTaskForm
        onAdd={(title, description) =>
          console.log("Add task:", { title, description })
        }
      />
    </div>
  );
}
