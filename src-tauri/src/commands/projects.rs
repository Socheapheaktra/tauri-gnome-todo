use crate::error::{command_not_configured, CommandError};
use crate::models::{CreateProjectPayload, ProjectDto, UpdateProjectPayload};

#[tauri::command]
pub fn create_project(_payload: CreateProjectPayload) -> Result<ProjectDto, CommandError> {
    Err(command_not_configured())
}

#[tauri::command]
pub fn update_project(
    _id: String,
    _payload: UpdateProjectPayload,
) -> Result<ProjectDto, CommandError> {
    Err(command_not_configured())
}

#[tauri::command]
pub fn delete_project(_id: String) -> Result<ProjectDto, CommandError> {
    Err(command_not_configured())
}

#[tauri::command]
pub fn archive_project(_id: String) -> Result<ProjectDto, CommandError> {
    Err(command_not_configured())
}

#[tauri::command]
pub fn list_projects(_include_archived: Option<bool>) -> Result<Vec<ProjectDto>, CommandError> {
    Err(command_not_configured())
}

#[tauri::command]
pub fn get_project_by_id(_id: String) -> Result<Option<ProjectDto>, CommandError> {
    Err(command_not_configured())
}
