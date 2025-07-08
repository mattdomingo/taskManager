import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TaskList } from '../components/TaskList'

describe('Drag and Drop', () => {
  it('should support drag and drop reordering (not implemented yet)', () => {
    const mockTasks = [
      { id: '1', text: 'Task 1', completed: false, priority: 0 },
      { id: '2', text: 'Task 2', completed: false, priority: 0 },
    ]
    
    render(
      <TaskList 
        tasks={mockTasks}
        onToggle={() => {}}
        onDelete={() => {}}
      />
    )
    
    // This test intentionally fails to keep CI red until drag-and-drop is implemented
    // TODO(drag): Implement drag-and-drop functionality and update this test
    expect(false).toBe(true) // Placeholder failing assertion
  })
}) 