import { Draggable } from '@hello-pangea/dnd'
import type { Task } from '../types'
import type { CSSProperties } from 'react';

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  isInCalendar?: boolean
  index?: number
}

/**
 * TaskItem component that renders individual tasks with enhanced drag-and-drop support.
 * When isInCalendar is true, renders in compact calendar style.
 * When isInCalendar is false, renders as draggable item for the task list.
 * During drag, tasks transform into a circular shape for better visual feedback.
 */
export function TaskItem({ 
  task, 
  onToggle, 
  onDelete, 
  isInCalendar = false, 
  index 
}: TaskItemProps) {
  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: number }) => {
    const colors = {
      2: 'bg-red-100 text-red-800',
      1: 'bg-yellow-100 text-yellow-800', 
      0: 'bg-gray-100 text-gray-600'
    };
    const labels = { 2: 'High', 1: 'Medium', 0: 'Low' };
    
    return (
      <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${colors[priority as keyof typeof colors]}`}>
        {labels[priority as keyof typeof labels]}
      </span>
    );
  };

  // Calendar tasks are not draggable and have compact styling
  if (isInCalendar) {
    return (
      <div className="apple-card p-4 mb-3 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="apple-checkbox"
          />
          <span 
            className={`apple-text-clean text-sm flex-1 font-medium ${
              task.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}
            title={task.text}
          >
            {task.text}
          </span>
          <button
            onClick={() => onDelete(task.id)}
            className="apple-delete-button"
            aria-label="Delete task"
          >
            ×
          </button>
        </div>
      </div>
    )
  }

  // Task list items are draggable
  if (index === undefined) {
    throw new Error('TaskItem: index is required when isInCalendar is false')
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        const style: CSSProperties = {
          ...provided.draggableProps.style,
          ...(snapshot.isDragging && {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '100px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'rgb(var(--apple-blue))',
            textAlign: 'center',
            lineHeight: '1.2',
            // Append our transforms to the library's transforms
            transform: `${provided.draggableProps.style?.transform || ''} scale(0.8) rotate(2deg)`,
          })
        };

        return (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`
              transition-all duration-300 cursor-grab active:cursor-grabbing
              ${snapshot.isDragging 
                ? 'opacity-90 bg-white/95 border-blue-300 shadow-2xl rounded-full z-50 backdrop-blur-sm' 
                : 'apple-card p-8 hover:shadow-lg hover:-translate-y-0.5'
              }
            `}
            style={style}
          >
            {snapshot.isDragging ? (
              // Compact circular representation during drag
              <div className="text-center leading-tight overflow-hidden">
                {task.text.split(' ').slice(0, 2).join(' ')}
                {task.text.split(' ').length > 2 && '...'}
              </div>
            ) : (
              // Normal task layout when not dragging
              <div className="flex items-center gap-6">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task.id)}
                  className="apple-checkbox"
                />
                <div className="flex-1 min-w-0">
                  <span 
                    className={`apple-text-clean block text-lg font-medium ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    {task.text}
                  </span>
                  <div className="flex items-center gap-3 mt-3">
                    <PriorityBadge priority={task.priority} />
                  </div>
                </div>
                <button
                  onClick={() => onDelete(task.id)}
                  className="apple-delete-button"
                  aria-label="Delete task"
                >
                  ×
                </button>
              </div>
            )}
          </li>
        )
      }}
    </Draggable>
  )
} 