import { useState } from 'react';

interface AddTaskFormProps {
  onAdd: (text: string) => void;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="apple-text-elegant text-2xl font-semibold text-gray-900 text-center">
        Add New Task
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What would you like to accomplish?"
            className="apple-input w-full px-8 py-6 text-lg placeholder-gray-500"
          />
        </div>
        <button
          type="submit"
          disabled={!text.trim()}
          className="apple-button w-full px-8 py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          Add Task
        </button>
      </form>
    </div>
  );
} 