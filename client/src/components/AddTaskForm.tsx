import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddTaskFormProps {
  onAdd: (title: string, description?: string) => void;
  placeholder?: string;
}

export default function AddTaskForm({ onAdd, placeholder = "Add a new task..." }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim() || undefined);
      setTitle("");
      setDescription("");
      setShowDescription(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          data-testid="input-task-title"
        />
        <Button type="submit" size="default" data-testid="button-add-task">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      {showDescription && (
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description (optional)"
          data-testid="input-task-description"
        />
      )}
      {!showDescription && (
        <button
          type="button"
          onClick={() => setShowDescription(true)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-show-description"
        >
          + Add description
        </button>
      )}
    </form>
  );
}
