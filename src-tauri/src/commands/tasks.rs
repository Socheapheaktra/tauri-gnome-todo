use crate::error::{command_not_configured, CommandError};
use crate::models::{
    CreateTaskPayload, ReorderTaskPayload, TaskDto, TaskWithProjectDto, UpdateTaskPayload,
};

#[tauri::command]
pub fn create_task(_payload: CreateTaskPayload) -> Result<TaskDto, CommandError> {
    Err(command_not_configured())
}

#[tauri::command]
pub fn update_task(_id: String, _payload: UpdateTaskPayload) -> Result<TaskDto, CommandError> {
    Err(command_not_configured())
}

#[tauri::command]
pub fn delete_task(_id: String) -> Result<TaskDto, CommandError> {
    Err(command_not_configured())
}

#[tauri::command]
pub fn complete_task(_id: String) -> Result<TaskDto, CommandError> {
    Err(command_not_configured())
}

#[tauri::command]
pub fn reopen_task(_id: String) -> Result<TaskDto, CommandError> {
    Err(command_not_configured())
}

#[tauri::command]
pub fn list_tasks_by_project(_project_id: String) -> Result<Vec<TaskDto>, CommandError> {
    Err(command_not_configured())
}

#[tauri::command]
pub fn list_today_tasks() -> Result<Vec<TaskWithProjectDto>, CommandError> {
    Err(command_not_configured())
}

#[tauri::command]
pub fn list_overdue_tasks() -> Result<Vec<TaskWithProjectDto>, CommandError> {
    Err(command_not_configured())
}

#[tauri::command]
pub fn reorder_tasks(_tasks: Vec<ReorderTaskPayload>) -> Result<Vec<TaskDto>, CommandError> {
    Err(command_not_configured())
}
