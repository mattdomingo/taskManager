# Task Manager

A simple, clean task management app built with React, TypeScript, and Tailwind CSS.

## Features

- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete  
- ✅ Delete tasks
- ✅ Automatic priority ordering (keyword-based sentiment analysis)

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Vitest** - Testing framework

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── AddTaskForm.tsx    # Form to add new tasks
│   ├── TaskItem.tsx       # Individual task component
│   └── TaskList.tsx       # List of tasks
├── test/
│   ├── setup.ts          # Test configuration
│   └── drag.spec.tsx     # Placeholder drag-and-drop tests
├── types.ts              # TypeScript interfaces
├── App.tsx               # Main application component
├── main.tsx              # React entry point
└── index.css             # Tailwind CSS imports
```

## Priority & Sentiment Analysis

Tasks are now **automatically sorted** by priority the moment you add them. A tiny sentiment-analysis helper scans the task's text for whole-word keywords (case-insensitive):

| Priority | Keywords (any) |
|----------|----------------|
| High (2) | urgent, asap, important, critical, immediately, now, today, high |
| Medium (1) | soon, normal, medium, later, upcoming |
| Low (0) | _default when no keyword is matched_ |

The scanner tokenises on non-alphabetic characters, so it will **not** match substrings. For example, `purgent` does **not** trigger a high priority match.

## Usage

1. **Adding Tasks**: Type in the input field and click "Add" or press Enter
2. **Completing Tasks**: Click the checkbox next to any task
3. **Deleting Tasks**: Click the "×" button next to any task

## Testing Edge Cases

To manually confirm correctness, try adding tasks with the following texts and ensure they appear in the expected order (top-to-bottom = high-to-low):

1. `"urgent: finish report"` → should be high priority.
2. `"purgent: typo test"` → should **not** be high priority (tests substring avoidance).
3. `"URGENT!!! deploy now"` → high priority despite casing/punctuation.
4. `"normal refactor"` → medium priority.
5. `"buy groceries"` → low priority.

Running `npm run dev` and visually inspecting the list is sufficient. No additional steps are required because priority is computed once on insertion and sorting is memoised for performance.

## Future Enhancements

- Drag-and-drop task reordering using `@hello-pangea/dnd`
- Local storage persistence
- Task filtering (all/active/completed)
- Due dates
