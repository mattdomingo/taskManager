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
  // Calendar tasks are not draggable and have compact styling
  if (isInCalendar) {
    return (
      <div className="flex items-center gap-2 p-2 border border-gray-200 rounded bg-gray-50">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="w-3 h-3 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0"
        />
        <span 
          className={`text-xs flex-1 truncate ${
            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}
          title={task.text}
        >
          {task.text}
        </span>
        <button
          onClick={() => onDelete(task.id)}
          className="w-4 h-4 text-red-500 hover:text-red-700 focus:outline-none flex-shrink-0"
          aria-label="Delete task"
        >
          ×
        </button>
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
            width: '60px',
            height: '60px',
            padding: '8px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#1d4ed8',
            textAlign: 'center',
            lineHeight: '1.2',
            // Append our transforms to the library's transforms
            transform: `${provided.draggableProps.style?.transform || ''} scale(0.75) rotate(2deg)`,
          })
        };

        return (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`
              transition-all duration-200 cursor-grab active:cursor-grabbing
              ${snapshot.isDragging 
                ? 'opacity-90 bg-blue-100 border-blue-300 shadow-2xl rounded-full z-50' 
                : 'flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50 hover:shadow-md'
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
              <>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span 
                  className={`flex-1 ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}
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
              </>
            )}
          </li>
        )
      }}
    </Draggable>
  )
} 