import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DragDropContext } from '@hello-pangea/dnd'
import { TaskList } from '../components/TaskList'
import { Calendar } from '../components/Calendar'
import type { Task } from '../types'

describe('Drag and Drop', () => {
  // Get a date string for a day in the current week to ensure the task appears in the calendar
  const getCurrentWeekDate = (): string => {
    const today = new Date()
    const currentDay = today.getDay()
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - daysToMonday)
    
    // Use Tuesday of the current week (Monday + 1 day)
    const tuesday = new Date(startOfWeek)
    tuesday.setDate(startOfWeek.getDate() + 1)
    
    const year = tuesday.getFullYear()
    const month = String(tuesday.getMonth() + 1).padStart(2, '0')
    const day = String(tuesday.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const mockTasks: Task[] = [
    { 
      id: '1', 
      text: 'Task 1', 
      completed: false, 
      priority: 0
    },
    { 
      id: '2', 
      text: 'Task 2', 
      completed: false, 
      priority: 1
    },
    { 
      id: '3', 
      text: 'Scheduled Task', 
      completed: false, 
      priority: 2,
      dueDate: getCurrentWeekDate()
    }
  ]

  const mockHandlers = {
    onToggle: () => {},
    onDelete: () => {},
    onDragEnd: () => {}
  }

  it('should render TaskList with draggable items for unscheduled tasks', () => {
    render(
      <DragDropContext onDragEnd={mockHandlers.onDragEnd}>
        <TaskList 
          tasks={mockTasks}
          onToggle={mockHandlers.onToggle}
          onDelete={mockHandlers.onDelete}
        />
      </DragDropContext>
    )
    
    // Should show only unscheduled tasks (tasks without dueDate)
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
    expect(screen.queryByText('Scheduled Task')).not.toBeInTheDocument()
    
    // Should show the unscheduled tasks section
    expect(screen.getByText('Unscheduled Tasks')).toBeInTheDocument()
  })

  it('should render Calendar with tasks in correct day columns', () => {
    render(
      <DragDropContext onDragEnd={mockHandlers.onDragEnd}>
        <Calendar
          tasks={mockTasks}
          onToggle={mockHandlers.onToggle}
          onDelete={mockHandlers.onDelete}
        />
      </DragDropContext>
    )
    
    // Should show calendar title
    expect(screen.getByText('Calendar')).toBeInTheDocument()
    
    // Should show scheduled task in calendar view
    expect(screen.getByText('Scheduled Task')).toBeInTheDocument()
    
    // Should show day names in the calendar
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Tue')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
  })

  it('should filter tasks correctly between TaskList and Calendar', () => {
    const { rerender } = render(
      <DragDropContext onDragEnd={mockHandlers.onDragEnd}>
        <TaskList 
          tasks={mockTasks}
          onToggle={mockHandlers.onToggle}
          onDelete={mockHandlers.onDelete}
        />
      </DragDropContext>
    )
    
    // TaskList should only show unscheduled tasks
    expect(screen.queryByText('Scheduled Task')).not.toBeInTheDocument()
    
    rerender(
      <DragDropContext onDragEnd={mockHandlers.onDragEnd}>
        <Calendar
          tasks={mockTasks}
          onToggle={mockHandlers.onToggle}
          onDelete={mockHandlers.onDelete}
        />
      </DragDropContext>
    )
    
    // Calendar should show scheduled task
    expect(screen.getByText('Scheduled Task')).toBeInTheDocument()
  })
}) 