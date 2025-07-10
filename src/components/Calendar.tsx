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
            width: '80px',
            height: '80px',
            padding: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'rgb(255, 59, 48)',
            textAlign: 'center',
            lineHeight: '1.1',
            // Append our transforms to the library's transforms
            transform: `${provided.draggableProps.style?.transform || ''} scale(0.8) rotate(1deg)`,
          })
        };

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`
              transition-all duration-300 cursor-grab active:cursor-grabbing
              ${snapshot.isDragging 
                ? 'opacity-90 bg-red-50/95 border-red-300 shadow-2xl rounded-full z-50 backdrop-blur-sm' 
                : 'apple-card p-4 hover:shadow-md hover:-translate-y-0.5 mb-3'
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
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task.id)}
                  className="apple-checkbox"
                />
                <span 
                  className={`apple-text-clean text-sm flex-1 font-medium truncate ${
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
            )}
          </div>
        )
      }}
    </Draggable>
  )

  return (
    <div className="apple-card-elevated p-12">
      <div className="text-center mb-12">
        <h2 className="apple-text-elegant text-3xl font-semibold text-gray-900 mb-4">
          Calendar
        </h2>
        <p className="text-base text-gray-600 font-medium">
          {new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
      </div>
      
      <div className="grid grid-cols-7 gap-6">
        {weekDates.map((date) => {
          const dateString = formatDateString(date)
          const dayTasks = tasksByDate[dateString] || []
          const todayFlag = isToday(date)
          
          return (
            <div key={dateString} className={`apple-card overflow-hidden ${
              todayFlag ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
            }`}>
              {/* Day header */}
              <div className={`p-6 text-center border-b ${
                todayFlag 
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' 
                  : 'bg-gray-50/50 border-gray-200'
              }`}>
                <div className={`text-base font-semibold ${todayFlag ? 'text-blue-900' : 'text-gray-900'}`}>
                  {getDayName(date)}
                </div>
                <div className={`text-sm font-medium mt-2 ${todayFlag ? 'text-blue-700' : 'text-gray-500'}`}>
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
                      min-h-[200px] p-5 space-y-3 transition-all duration-300 relative
                      ${snapshot.isDraggingOver 
                        ? 'bg-gradient-to-br from-green-50 to-green-100 shadow-inner' 
                        : todayFlag 
                          ? 'bg-blue-50/30' 
                          : 'bg-white hover:bg-gray-50/50'
                      }
                    `}
                    style={{
                      // Ensure full hit area coverage
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {/* Render tasks scheduled for this day */}
                    <div className={`space-y-3 ${snapshot.isDraggingOver ? 'opacity-60' : ''}`}>
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
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm text-center leading-tight pointer-events-none">
                        <div className="p-6">
                          <div className="text-2xl mb-3">📅</div>
                          <div className="font-medium">Drag tasks here</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Drop zone indicator - positioned to not block events */}
                    {snapshot.isDraggingOver && (
                      <div className="absolute top-3 right-3 pointer-events-none z-10">
                        <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
                          Schedule
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
      <div className="mt-12 text-center">
        <p className="apple-text-clean text-base text-gray-500 font-medium">
          💡 Drag tasks back to the unscheduled list to remove from calendar
        </p>
      </div>
    </div>
  )
} 