import type { Task } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">No tasks yet. Add one above!</p>
    );
  }

  return (
    <ul className="space-y-2">
      {/* TODO(drag): Replace this plain <ul> with DragDropContext when implementing drag-and-drop functionality */}
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
} 