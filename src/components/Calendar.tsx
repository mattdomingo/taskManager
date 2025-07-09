import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import type { Task } from '../types'

interface CalendarProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

/**
 * Calendar component that displays a weekly view with enhanced drag-and-drop support.
 * Tasks with due dates are rendered in their corresponding day columns.
 * Provides clear visual feedback during drag operations.
 * Scheduled tasks can be dragged back to the task list to unschedule them.
 */
export function Calendar({ tasks, onToggle, onDelete }: CalendarProps) {
  // Generate the current week's dates starting from Monday
  const weekDates = useMemo(() => {
    const today = new Date()
    const currentDay = today.getDay()
    // Calculate days to subtract to get to Monday (0 = Sunday, 1 = Monday, etc.)
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1
    
    // Create start of week without mutating the original date
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - daysToMonday)
    
    // Generate array of 7 dates for the week, creating new Date objects to avoid mutation
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + index)
      return date
    })
  }, [])

  // Group tasks by their due date for efficient lookup
  const tasksByDate = useMemo(() => {
    const groups: Record<string, Task[]> = {}
    
    tasks.forEach(task => {
      if (task.dueDate) {
        if (!groups[task.dueDate]) {
          groups[task.dueDate] = []
        }
        groups[task.dueDate].push(task)
      }
    })
    
    return groups
  }, [tasks])

  // Format date as YYYY-MM-DD to match the dueDate format
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Get day name for display
  const getDayName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  // Get day and month for display
  const getDayMonth = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Check if date is today
  const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  /**
   * CalendarTaskItem - A draggable task item for calendar cells
   */
  const CalendarTaskItem = ({ task, index }: { task: Task; index: number }) => (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        const style: CSSProperties = {
          ...provided.draggableProps.style,
          // Apply layout changes when dragging for circular effect
          ...(snapshot.isDragging && {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            padding: '4px',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#dc2626',
            textAlign: 'center',
            lineHeight: '1.1',
            // Append our transforms to the library's transforms
            transform: `${provided.draggableProps.style?.transform || ''} scale(0.75) rotate(1deg)`,
          })
        };

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`
              transition-all duration-200 cursor-grab active:cursor-grabbing
              ${snapshot.isDragging 
                ? 'opacity-90 bg-red-100 border-red-300 shadow-2xl rounded-full z-50' 
                : 'flex items-center gap-2 p-2 border border-gray-200 rounded bg-gray-50 hover:bg-gray-100 hover:shadow-sm'
              }
            `}
            style={style}
          >
            {snapshot.isDragging ? (
              // Compact circular representation during drag (for removal)
              <div className="text-center leading-tight overflow-hidden">
                {task.text.split(' ')[0]}
                <div className="text-xs">📅→📝</div>
              </div>
            ) : (
              // Normal calendar task layout
              <>
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
              </>
            )}
          </div>
        )
      }}
    </Draggable>
  )

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
        Calendar
      </h2>
      
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date) => {
          const dateString = formatDateString(date)
          const dayTasks = tasksByDate[dateString] || []
          const todayFlag = isToday(date)
          
          return (
            <div key={dateString} className={`border-2 rounded-lg ${
              todayFlag ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
            }`}>
              {/* Day header */}
              <div className={`p-2 text-center border-b-2 ${
                todayFlag 
                  ? 'bg-blue-100 border-blue-200 text-blue-900' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}>
                <div className={`text-sm font-medium ${todayFlag ? 'font-bold' : ''}`}>
                  {getDayName(date)}
                </div>
                <div className={`text-xs ${todayFlag ? 'text-blue-700' : 'text-gray-500'}`}>
                  {getDayMonth(date)}
                </div>
              </div>
              
              {/* Droppable area for tasks */}
              <Droppable droppableId={`calendar-day-${dateString}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      min-h-[120px] p-2 space-y-1 transition-colors duration-200 relative
                      ${snapshot.isDraggingOver 
                        ? 'bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400 border-dashed shadow-lg' 
                        : todayFlag 
                          ? 'bg-blue-50/50' 
                          : 'bg-white hover:bg-gray-50'
                      }
                    `}
                    style={{
                      // Ensure full hit area coverage
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {/* Render tasks scheduled for this day */}
                    <div className={`space-y-1 ${snapshot.isDraggingOver ? 'opacity-50' : ''}`}>
                      {dayTasks.map((task, taskIndex) => (
                        <CalendarTaskItem
                          key={task.id}
                          task={task}
                          index={taskIndex}
                        />
                      ))}
                    </div>
                    
                    {/* Empty state hint - only show when not dragging */}
                    {dayTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs text-center leading-tight pointer-events-none">
                        Drag tasks here
                      </div>
                    )}
                    
                    {/* Drop zone indicator - positioned to not block events */}
                    {snapshot.isDraggingOver && (
                      <div className="absolute top-1 right-1 pointer-events-none z-10">
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse">
                          Drop here
                        </div>
                      </div>
                    )}
                    
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
      
      {/* Helpful hint */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        💡 Drag tasks back to the unscheduled list to remove from calendar
      </div>
    </div>
  )
} 