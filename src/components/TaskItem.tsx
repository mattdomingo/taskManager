import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <span 
        className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
      >
        {task.text}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="w-6 h-6 text-red-500 hover:text-red-700 focus:outline-none"
        aria-label="Delete task"
      >
        ×
      </button>
    </li>
  );
} 