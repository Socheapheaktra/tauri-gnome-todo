# GNOME-Inspired Tauri TODO App — Agentic Coding Task List

## Stack Decisions

- Desktop: Tauri v2
- Frontend: React + TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Database: PostgreSQL
- ORM: Prisma
- Deployment/dev environment: Docker Compose
- Platform priority: Linux first
- User model: Single-user only
- Core structure: Projects contain Tasks
- Attachments: Not required

---

## 1. Project Setup

### 1.1 Initialize Tauri App
Create a new Tauri v2 desktop application using React and TypeScript as the frontend.

### 1.2 Configure Project Structure
Organize the project into clear folders:

```text
src/
  components/
  features/
  layouts/
  lib/
  pages/
  stores/
src-tauri/
prisma/
docker/
```

### 1.3 Install Frontend Dependencies
Install and configure:

- Tailwind CSS
- shadcn/ui
- lucide-react
- React Router
- Zustand or TanStack Query
- date-fns

### 1.4 Install Backend/Database Dependencies
Install Prisma and PostgreSQL client dependencies.

---

## 2. Docker Setup

### 2.1 Create Docker Compose File
Create `docker-compose.yml` with:

- PostgreSQL database service
- Optional Adminer or pgAdmin service

### 2.2 Configure Environment Variables
Create `.env`:

```env
DATABASE_URL="postgresql://todo_user:todo_password@localhost:5432/todo_app"
```

### 2.3 Add Database Startup Scripts
Ensure the database starts locally with:

```bash
docker compose up -d
```

---

## 3. Prisma Schema

### 3.1 Create Project Model
A project groups related tasks.

Fields:

- `id`
- `name`
- `description`
- `color`
- `isArchived`
- `createdAt`
- `updatedAt`

### 3.2 Create Task Model
A task belongs to one project.

Fields:

- `id`
- `projectId`
- `title`
- `description`
- `status`
- `priority`
- `dueDate`
- `completedAt`
- `sortOrder`
- `createdAt`
- `updatedAt`

### 3.3 Create AppSetting Model
Store single-user app preferences.

Fields:

- `id`
- `key`
- `value`
- `createdAt`
- `updatedAt`

### 3.4 Add Prisma Migration
Generate and apply the initial migration.

```bash
npx prisma migrate dev --name init
```

---

## 4. Data Access Layer

### 4.1 Create Prisma Client Wrapper
Create a reusable Prisma client instance.

### 4.2 Implement Project Repository
Functions:

- create project
- update project
- delete project
- archive project
- list projects
- get project by id

### 4.3 Implement Task Repository
Functions:

- create task
- update task
- delete task
- complete task
- reopen task
- list tasks by project
- list today tasks
- list overdue tasks
- reorder tasks

---

## 5. Tauri Commands

### 5.1 Expose Project Commands
Create Tauri commands for project CRUD operations.

### 5.2 Expose Task Commands
Create Tauri commands for task CRUD operations.

### 5.3 Expose Settings Commands
Create commands for reading and updating app settings.

### 5.4 Add Error Handling
Return clean frontend-safe errors from Rust/Tauri commands.

---

## 6. Frontend Layout

### 6.1 Create GNOME-Style App Shell
Build a layout with:

- header bar
- left sidebar
- main content area
- optional task detail panel

### 6.2 Create Header Bar
Include:

- app title
- add task button
- search button
- settings button

### 6.3 Create Sidebar
Sidebar should display:

- Inbox or All Tasks
- Today
- Upcoming
- Completed
- Projects list

### 6.4 Create Main Task View
Display tasks for the selected project or smart view.

---

## 7. Project Features

### 7.1 Project List UI
Show all active projects in the sidebar.

### 7.2 Create Project Dialog
Use shadcn dialog component to create a project.

### 7.3 Edit Project Dialog
Allow renaming, changing description, and changing color.

### 7.4 Archive Project
Archived projects should be hidden from the normal sidebar.

### 7.5 Delete Project
Delete project and related tasks after confirmation.

---

## 8. Task Features

### 8.1 Add Task Form
Allow quick task creation from the current project view.

### 8.2 Task Item Component
Each task should show:

- checkbox
- title
- due date
- priority
- project name when needed

### 8.3 Task Detail Panel
Allow editing:

- title
- description
- project
- due date
- priority
- status

### 8.4 Complete/Reopen Task
Clicking the checkbox should toggle completion.

### 8.5 Delete Task
Allow deleting a task with confirmation or undo.

### 8.6 Reorder Tasks
Support drag-and-drop ordering inside a project.

---

## 9. Smart Views

### 9.1 All Tasks View
Show all incomplete tasks across projects.

### 9.2 Today View
Show tasks due today.

### 9.3 Upcoming View
Show future scheduled tasks.

### 9.4 Overdue View
Show tasks past due date.

### 9.5 Completed View
Show completed tasks grouped by completion date.

---

## 10. Search

### 10.1 Add Search UI
Create a GNOME-style search bar in the header.

### 10.2 Implement Local Search
Search by:

- task title
- task description
- project name

### 10.3 Search Result View
Show matching tasks with project context.

---

## 11. Styling and UX

### 11.1 Configure shadcn Theme
Use a clean GNOME-inspired theme with:

- soft borders
- rounded panels
- subtle shadows
- simple typography

### 11.2 Add Empty States
Create empty states for:

- no projects
- no tasks
- no search results
- completed all tasks

### 11.3 Add Keyboard Shortcuts
Support:

- `Ctrl + N`: new task
- `Ctrl + Shift + N`: new project
- `Ctrl + F`: search
- `Esc`: close dialog or detail panel

### 11.4 Add Responsive Desktop Layout
Ensure the UI works well on small and large desktop windows.

---

## 12. Settings

### 12.1 Preferences Dialog
Create settings page/dialog.

### 12.2 Theme Setting
Support:

- system
- light
- dark

### 12.3 Default Startup View
Allow choosing startup view:

- All Tasks
- Today
- Last Opened Project

---

## 13. Linux Packaging

### 13.1 Configure Tauri App Metadata
Set:

- app name
- app icon
- identifier
- version
- description

### 13.2 Configure Linux Bundle
Prepare Linux builds for:

- AppImage
- `.deb`
- optionally `.rpm`

### 13.3 Add Desktop File Metadata
Set Linux desktop launcher name, icon, and categories.

---

## 14. Testing

### 14.1 Test Prisma Repositories
Test project and task database logic.

### 14.2 Test Tauri Commands
Verify command input/output behavior.

### 14.3 Test Frontend Components
Test:

- task item
- project sidebar
- task form
- project form

### 14.4 Test Main User Flows
Cover:

- create project
- create task
- complete task
- edit task
- delete task
- search task

---

## 15. Developer Documentation

### 15.1 Create README
Include:

- project overview
- stack
- setup steps
- Docker commands
- Prisma commands
- Tauri dev commands
- build commands

### 15.2 Add Local Development Guide
Document:

```bash
docker compose up -d
npm install
npx prisma migrate dev
npm run tauri dev
```

### 15.3 Add Database Schema Notes
Explain Project, Task, and AppSetting models.

---

## MVP Completion Criteria

The MVP is complete when the app can:

- run on Linux using Tauri
- connect to PostgreSQL via Prisma
- run database through Docker Compose
- create, edit, archive, and delete projects
- create, edit, complete, reorder, and delete tasks
- display tasks under projects
- show Today, Upcoming, Overdue, and Completed views
- search tasks locally
- persist all data in PostgreSQL
- provide a GNOME-inspired desktop UI

