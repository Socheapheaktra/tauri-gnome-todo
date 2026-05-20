# Changelog

## 1.0.1

- Reworked task details from a right-side panel into a full main-content form view opened by clicking a task.
- Returned to the task list after saving a task from the form view.
- Kept the task list visible after creating a new task instead of opening the new task immediately.
- Removed the redundant task-list header button now that form view has its own back action.
- Made task rows show a pointer cursor on hover and removed the extra trailing task action icon.
- Added a shadcn-style due date picker with month navigation and clear action.
- Defaulted unset due dates to the current date in create and edit flows.
- Isolated Tauri dev data in the project-local `.dev-data/tasks.sqlite3` database while release builds continue using the platform app data directory.
