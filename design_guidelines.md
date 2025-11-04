# Design Guidelines: Personal Productivity Tracker

## Design Approach
**System-Based Design** inspired by modern productivity tools (Todoist, Linear, Notion) with emphasis on clarity, efficiency, and motivational visual feedback. Clean, distraction-free interface optimized for daily use and quick task management.

## Core Design Principles
1. **Clarity First**: Remove visual noise to focus attention on tasks and progress
2. **Instant Feedback**: Visual confirmation for every action (check, complete, add)
3. **Motivational Design**: Use progress visualization to encourage consistency
4. **Efficiency**: Minimize clicks and cognitive load for daily routine

## Typography System
- **Primary Font**: Inter or DM Sans (clean, modern sans-serif)
- **Headings**: 
  - Page titles: text-3xl to text-4xl, font-bold
  - Section headers: text-xl to text-2xl, font-semibold
  - Card titles: text-lg, font-medium
- **Body Text**: text-base, font-normal for task descriptions
- **Supporting Text**: text-sm for timestamps, metadata, secondary information
- **Data Labels**: text-xs, uppercase tracking-wide for chart labels and stats

## Layout & Spacing System
**Spacing Units**: Use Tailwind units of 2, 4, 6, 8, and 12 for consistent rhythm
- Component padding: p-4 to p-6
- Section gaps: gap-6 to gap-8
- Page margins: Container max-w-7xl with px-4 to px-8
- Card spacing: space-y-4 internally

## Application Structure

### Navigation
Side navigation (desktop) with collapsible mobile menu:
- Dashboard (home/overview)
- Today's Tasks
- Plan Tomorrow
- Progress & Stats
- Settings

Clean icon + label navigation with active state indicators

### Dashboard/Home Page
**Three-Column Layout (desktop, stacked mobile)**:

**Left Column** (40% width):
- Today's date prominently displayed
- Quick stats cards showing:
  - Tasks completed today (with percentage)
  - Current streak count
  - This week's completion rate
- Mini calendar heat map showing last 30 days

**Center Column** (60% width):
- Active tasks list with checkboxes
- Each task card includes:
  - Large checkbox (left aligned)
  - Task title and optional description
  - Time added/due indicator
  - Quick delete icon (subtle, right aligned)
- Empty state with encouraging message
- Add task input at bottom (always visible, sticky)

**Right Column** (collapsible sidebar):
- Completed tasks for today
- Grayed out appearance with strikethrough
- Timestamp of completion
- Option to undo completion

### Today's Tasks Page
Full-width, focused task management:
- Header with date and completion progress bar
- Kanban-style sections:
  - **To Do** (left): Pending tasks with drag handles
  - **Completed** (right): Finished tasks, collapsed by default
- Large, prominent "Add Task" button with keyboard shortcut hint
- Bulk actions: "Mark all complete", "Clear completed"

### Plan Tomorrow Page
Calendar-focused interface:
- Date selector prominently at top
- Task template library (frequent tasks for quick add)
- Draft task list with:
  - Priority indicators (high/medium/low with visual badges)
  - Estimated time fields
  - Notes/description textarea
- Preview mode showing tomorrow's schedule
- "Commit Plan" button to finalize tomorrow's tasks

### Progress & Stats Page
Data visualization dashboard:

**Top Section**:
- Overview cards (grid layout):
  - Total tasks completed (all time)
  - Longest streak
  - Average daily completion rate
  - This month's performance

**Main Graph Section**:
- Line/area chart showing completion rate over time (30/60/90 day views)
- X-axis: Dates
- Y-axis: Percentage of tasks completed
- Visual markers for perfect days (100% completion)
- Highlighting for days with zero completion

**Heat Map Calendar**:
- GitHub-style contribution graph
- Each day colored by completion percentage
- Darker shades = higher completion
- White/light = missed days
- Tooltips showing exact stats on hover

**Trends Section**:
- Bar chart comparing week-by-week performance
- Best performing day of week breakdown
- Task completion time patterns

## Component Library

### Task Item Component
- Minimum height: h-16
- Rounded corners with subtle shadow on hover
- Checkbox: Large (w-6 h-6), custom styled with smooth check animation
- Transition on completion: fade and slide to completed section
- Hover state: slight lift and background change

### Progress Bar
- Height: h-2 to h-3
- Rounded-full ends
- Animated fill with transition-all
- Percentage label above or inline

### Stat Card
- Rounded-lg border
- Padding: p-6
- Large number display: text-4xl font-bold
- Label below: text-sm
- Icon in top right corner

### Calendar Heat Map
- Grid of small squares (w-3 h-3)
- Consistent gap between cells
- Rounded corners on each cell
- Smooth opacity transitions on load

### Graph/Chart Components
- Clean axis lines with minimal gridlines
- Data points with hover tooltips
- Responsive scaling
- Legend positioned top-right or bottom

### Input Fields
- Task input: Large (h-12 to h-14), rounded-lg
- Placeholder text with helpful hints
- Focus state with subtle outline
- "Enter" to submit functionality clearly indicated

### Buttons
- Primary actions: Prominent, rounded-lg, medium size (px-6 py-3)
- Secondary actions: Ghost/outline style
- Delete/destructive: Subtle, only visible on row hover
- Icon buttons: Circular or square with padding

### Empty States
- Centered illustration or icon
- Encouraging message
- Clear call-to-action button
- Appears when no tasks exist

## Interactions & Feedback

### Task Completion
- Checkbox check: Smooth animation (scale + check mark draw)
- Row transition: Fade and slide to completed section (300ms)
- Confetti or subtle success animation on first completion of the day
- Sound effect option (toggleable in settings)

### Adding Tasks
- Input auto-focus on page load
- Smooth list insertion animation
- Brief highlight on newly added task
- Clear feedback on empty submission

### Progress Updates
- Graph animates on load (draws from left to right)
- Stat counters animate from 0 to actual value
- Real-time updates when tasks complete

## Visual Hierarchy

**Emphasis Levels**:
1. **Primary**: Active tasks, main CTAs, key stats
2. **Secondary**: Completed tasks, navigation, supporting actions  
3. **Tertiary**: Timestamps, metadata, helper text

**Contrast Strategy**:
- High contrast for task titles and checkboxes
- Medium contrast for descriptions and secondary text
- Low contrast for dividers and background elements

## Responsive Behavior
- Desktop (lg+): Three-column dashboard, side navigation
- Tablet (md): Two-column with collapsible sidebar
- Mobile: Single column, bottom navigation, full-width cards
- Stack chart sections vertically on mobile
- Larger touch targets (min-h-12) for mobile interactions

## Images
This application does not require hero images or decorative photography. Visual interest comes from data visualization, iconography, and well-designed UI components. Use icon libraries (Heroicons recommended) for navigation, empty states, and stat cards.