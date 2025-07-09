export interface Task {
  id: string;      // crypto.randomUUID()
  text: string;
  completed: boolean;
  /**
   * Computed priority score for the task.
   * Higher numbers indicate higher priority.
   * 2 – high, 1 – medium, 0 – low
   */
  priority: number;
  /**
   * Optional due date for the task in YYYY-MM-DD format.
   * When set, the task will appear in the calendar view.
   */
  dueDate?: string;
} 