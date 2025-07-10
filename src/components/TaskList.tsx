import { Droppable } from '@hello-pangea/dnd'
import type { Task } from '../types'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

/**
 * TaskList component that displays unscheduled tasks (without due dates) in an enhanced droppable area.
 * Tasks can be dragged from here to the calendar to schedule them.
 * Scheduled tasks can be dragged back here to remove their due dates.
 */
export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  // Filter out tasks that have due dates - only show unscheduled tasks
  const unscheduledTasks = tasks.filter(task => !task.dueDate)

  if (unscheduledTasks.length === 0) {
    return (
      <div className="apple-card-elevated p-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="apple-text-elegant text-3xl font-semibold text-gray-900">
            Tasks
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            <span className="text-base font-medium text-gray-500">Unscheduled</span>
          </div>
        </div>
        
        <Droppable droppableId="task-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`
                min-h-[400px] p-12 rounded-3xl border-2 border-dashed transition-all duration-300 relative
                ${snapshot.isDraggingOver 
                  ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 scale-[1.01] shadow-lg' 
                  : 'border-gray-300 bg-gray-50/50'
                }
              `}
              style={{
                // Ensure proper drop zone detection
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Drop zone indicator for empty state */}
              {snapshot.isDraggingOver ? (
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 pointer-events-none z-10">
                  <div className="apple-button px-8 py-4 text-base font-semibold animate-pulse">
                    Drop here to unschedule
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center pointer-events-none">
                  <div className="text-6xl mb-8">📝</div>
                  <h3 className="apple-text-elegant text-2xl font-semibold text-gray-700 mb-4">No unscheduled tasks</h3>
                  <p className="apple-text-clean text-base leading-relaxed max-w-md">
                    Add a new task above or drag scheduled tasks here to unschedule them
                  </p>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    )
  }

  return (
    <div className="apple-card-elevated p-12">
      <div className="flex items-center justify-between mb-10">
        <h2 className="apple-text-elegant text-3xl font-semibold text-gray-900">
          Tasks
        </h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-base font-medium text-gray-500">Unscheduled</span>
          </div>
          <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-base font-semibold">
            {unscheduledTasks.length}
          </span>
        </div>
      </div>
      
      <Droppable droppableId="task-list">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              space-y-4 min-h-[400px] p-8 rounded-3xl border-2 border-dashed transition-all duration-300 relative
              ${snapshot.isDraggingOver 
                ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 scale-[1.005] shadow-lg' 
                : 'border-gray-300 bg-gray-50/30 hover:bg-gray-50/50'
              }
            `}
            style={{
              // Ensure proper drop zone detection
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Task list with slight opacity when dragging over */}
            <ul className={`space-y-4 ${snapshot.isDraggingOver ? 'opacity-70' : ''}`}>
              {unscheduledTasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  index={index}
                />
              ))}
            </ul>
            
            {/* Drop zone indicator overlay */}
            {snapshot.isDraggingOver && (
              <div className="absolute top-6 right-6 z-10 pointer-events-none">
                <div className="apple-button px-6 py-3 text-sm font-semibold animate-bounce">
                  Drop to unschedule
                </div>
              </div>
            )}
            
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      {/* Helpful hint */}
      <div className="mt-10 text-center">
        <p className="apple-text-clean text-base text-gray-500 font-medium">
          💡 Drag tasks to calendar days to schedule them
        </p>
      </div>
    </div>
  )
} 