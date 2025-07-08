import { useState, useMemo } from 'react'
import type { Task } from './types'
import { AddTaskForm } from './components/AddTaskForm'
import { TaskList } from './components/TaskList'
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

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => b.priority - a.priority),
    [tasks]
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Task Manager
          </h1>
          
          <AddTaskForm onAdd={addTask} />
          
          {/* TODO(drag): When implementing drag-and-drop, wrap TaskList with DragDropContext here */}
          <TaskList 
            tasks={sortedTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </div>
      </div>
    </div>
  )
}

export default App
