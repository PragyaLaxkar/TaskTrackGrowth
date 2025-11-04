# Daily Task Tracker

## Overview

A personal productivity application focused on daily task management and habit tracking. The application helps users maintain consistency through visual progress tracking, streak monitoring, and completion rate analytics. Built as a full-stack web application with a modern React frontend and Express backend, featuring a PostgreSQL database for persistent storage.

The core value proposition is simple: track daily tasks, build streaks, and visualize progress over time to maintain motivation and consistency in personal productivity routines.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing (alternative to React Router)
- **TanStack Query** (React Query) for server state management, caching, and data synchronization

**UI Component System**
- **shadcn/ui** components built on Radix UI primitives for accessible, customizable UI elements
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Design System**: "New York" style variant with neutral color palette, custom spacing units, and CSS variables for theming
- **Dark Mode**: Toggle-based theme switching with localStorage persistence

**State Management Strategy**
- Server state managed through React Query with invalidation on mutations
- Local UI state handled with React hooks (useState, useContext)
- No global state management library (Redux, Zustand) - deliberate simplicity
- Form state managed locally within components

**Data Visualization**
- **Recharts** library for line charts and area charts showing completion trends
- Custom calendar heatmap component for 30-day activity visualization
- Color-coded progress indicators based on completion rates

### Backend Architecture

**Server Framework**
- **Express.js** running on Node.js with TypeScript
- RESTful API design with resource-based routing
- Middleware pipeline for logging, JSON parsing, and error handling

**API Design Patterns**
- Resource-oriented endpoints: `/api/tasks/:date`, `/api/stats/range/:start/:end`
- Standard HTTP methods: GET for retrieval, POST for creation, PATCH for updates, DELETE for removal
- Validation using Zod schemas with error formatting via `zod-validation-error`
- Consistent error responses with appropriate HTTP status codes

**Development Strategy**
- In-memory storage implementation (`MemStorage`) for initial development and testing
- Storage interface (`IStorage`) abstracts data layer for easy database integration
- Vite middleware integration for seamless development experience with HMR

### Data Storage

**Database Solution**
- **PostgreSQL** (via Neon serverless) for production data persistence
- **Drizzle ORM** for type-safe database queries and schema management
- Schema-first design with TypeScript type inference from database schema

**Data Models**

1. **Tasks Table**
   - Primary entity for daily task tracking
   - Fields: id (UUID), title, description (optional), completed (boolean), date, completedAt timestamp, createdAt timestamp
   - Date-based partitioning for efficient queries by day

2. **Daily Stats Table**
   - Aggregated metrics per day
   - Fields: id, date (unique), totalTasks, completedTasks, completionRate (percentage)
   - Updated automatically when tasks are modified
   - Supports range queries for chart data and heatmaps

**Migration Strategy**
- Drizzle Kit for schema migrations
- `db:push` script for development schema synchronization
- Migrations stored in `/migrations` directory

### External Dependencies

**Core Production Dependencies**
- `@neondatabase/serverless`: PostgreSQL client optimized for serverless environments
- `drizzle-orm`: Type-safe ORM with PostgreSQL dialect
- `@tanstack/react-query`: Server state management and caching
- `date-fns`: Date manipulation and formatting utilities
- `recharts`: Chart rendering library
- `wouter`: Lightweight routing for React

**UI Component Libraries**
- `@radix-ui/*`: Headless UI primitives (15+ components including Dialog, Dropdown, Popover, Toast, etc.)
- `lucide-react`: Icon library
- `class-variance-authority`: Type-safe variant-based component styling
- `tailwindcss`: Utility-first CSS framework

**Form Handling**
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Integration with Zod validation
- `zod`: Runtime type validation and schema definition

**Development Tools**
- `typescript`: Static type checking
- `vite`: Build tool and dev server
- `tsx`: TypeScript execution for development
- `esbuild`: Production bundling for server code

**Session Management**
- `express-session` with `connect-pg-simple`: PostgreSQL-backed session store
- Cookie-based authentication ready (infrastructure in place)

### Design Philosophy

**Clarity and Simplicity**
- Minimal cognitive load with distraction-free interface
- System-inspired design (Todoist, Linear, Notion aesthetics)
- Progressive disclosure: optional task descriptions, expandable details

**Performance Optimization**
- Stale-while-revalidate caching via React Query
- Optimistic updates for instant UI feedback
- Query invalidation strategy ensures data consistency across views

**Responsive Design**
- Mobile-first approach with collapsible sidebar
- Adaptive layouts: three-column desktop, stacked mobile
- Touch-friendly interactions for mobile devices

**Accessibility**
- Radix UI primitives provide ARIA attributes and keyboard navigation
- Focus management and screen reader support built-in
- Semantic HTML structure