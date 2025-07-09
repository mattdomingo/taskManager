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
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
          Unscheduled Tasks
        </h2>
        
        <Droppable droppableId="task-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`
                min-h-[200px] p-4 rounded-lg border-2 border-dashed transition-all duration-200 relative
                ${snapshot.isDraggingOver 
                  ? 'border-blue-400 bg-gradient-to-br from-blue-100 to-blue-200 scale-[1.02] shadow-lg' 
                  : 'border-gray-300 bg-gray-50'
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
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-10">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
                    Drop here to unschedule
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center pointer-events-none">
                  <div className="text-2xl mb-2">📝</div>
                  <p className="text-sm leading-relaxed">
                    No unscheduled tasks.<br />
                    Add a new task above or drag scheduled tasks here to unschedule them!
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
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
        Unscheduled Tasks
        <span className="ml-auto text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {unscheduledTasks.length}
        </span>
      </h2>
      
      <Droppable droppableId="task-list">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              space-y-2 min-h-[200px] p-3 rounded-lg border-2 border-dashed transition-all duration-200 relative
              ${snapshot.isDraggingOver 
                ? 'border-blue-400 bg-gradient-to-br from-blue-100 to-blue-200 scale-[1.01] shadow-lg' 
                : 'border-gray-300 bg-gray-50/50 hover:bg-gray-50'
              }
            `}
            style={{
              // Ensure proper drop zone detection
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Task list with slight opacity when dragging over */}
            <div className={`space-y-2 ${snapshot.isDraggingOver ? 'opacity-70' : ''}`}>
              {unscheduledTasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  index={index}
                />
              ))}
            </div>
            
            {/* Drop zone indicator overlay */}
            {snapshot.isDraggingOver && (
              <div className="absolute top-2 right-2 z-10 pointer-events-none">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-bounce">
                  Drop to unschedule
                </div>
              </div>
            )}
            
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      {/* Helpful hint */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        💡 Drag tasks to calendar days to schedule them
      </div>
    </div>
  )
} 