import { useState, useMemo } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import type { Task } from './types'
import { AddTaskForm } from './components/AddTaskForm'
import { TaskList } from './components/TaskList'
import { Calendar } from './components/Calendar'
import { getTaskPriority } from './utils/priority'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority: getTaskPriority(text),
    }
    setTasks(prevTasks => [...prevTasks, newTask])
  }

  const toggleTask = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
  }

  /**
   * Handles drag and drop events for scheduling tasks.
   * When a task is dropped on a calendar day, updates the task's dueDate.
   * When a task is dropped back on the task list, removes the dueDate.
   */
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If there's no destination, the drag was cancelled
    if (!destination) {
      return
    }

    // If the item was dropped in the same position, no change needed
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Find the task being dragged
    const draggedTask = tasks.find(task => task.id === draggableId)
    if (!draggedTask) {
      return
    }

    // Handle dropping on calendar days
    if (destination.droppableId.startsWith('calendar-day-')) {
      // Extract the date from the droppableId (format: calendar-day-YYYY-MM-DD)
      const dateString = destination.droppableId.replace('calendar-day-', '')
      
      // Update the task's due date and ensure proper state re-render
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === draggableId 
            ? { ...task, dueDate: dateString }
            : task
        )
      )
      return
    }

    // Handle dropping back on task list (removing due date)
    if (destination.droppableId === 'task-list') {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === draggableId 
            ? { ...task, dueDate: undefined }
            : task
        )
      )
      return
    }

    // Handle reordering within the same list (task list only)
    if (
      source.droppableId === 'task-list' && 
      destination.droppableId === 'task-list'
    ) {
      // For now, we maintain priority-based sorting, so reordering doesn't persist
      // This could be enhanced in the future to allow manual ordering
      return
    }
  }

  // Sort tasks by priority for display
  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => b.priority - a.priority),
    [tasks]
  )

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-8">
        <div className="mx-auto max-w-8xl">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="apple-text-elegant text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Task Manager
            </h1>
            <p className="apple-text-clean text-xl text-gray-600 font-medium">
              Organize your day with elegant simplicity
            </p>
          </div>
          
          {/* Add Task Form */}
          <div className="mb-24 max-w-2xl mx-auto">
            <div className="apple-card-elevated p-12">
              <AddTaskForm onAdd={addTask} />
            </div>
          </div>

          {/* Main Content: Task List and Calendar */}
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-16">
            {/* Task List */}
            <div className="space-y-8">
              <TaskList 
                tasks={sortedTasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            </div>

            {/* Calendar */}
            <div className="space-y-8">
              <Calendar
                tasks={sortedTasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  )
}

export default App
