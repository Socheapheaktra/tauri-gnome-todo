use rusqlite::{params, OptionalExtension, Row};
use tauri::State;
use uuid::Uuid;

use crate::db::DbState;
use crate::error::{CommandError, CommandResultExt};
use crate::models::{CreateProjectPayload, ProjectDto, UpdateProjectPayload};

#[tauri::command]
pub fn create_project(
    payload: CreateProjectPayload,
    state: State<'_, DbState>,
) -> Result<ProjectDto, CommandError> {
    let id = format!("project-{}", Uuid::new_v4());
    let conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;

    conn.execute(
        r#"
        INSERT INTO projects (id, name, description, color)
        VALUES (?1, ?2, ?3, ?4)
        "#,
        params![
            id,
            payload.name.trim(),
            empty_to_none(payload.description),
            payload.color
        ],
    )
    .map_command_error("Unable to create project")?;

    get_project(&conn, &id)?.ok_or_else(|| CommandError::internal("Project was not created"))
}

#[tauri::command]
pub fn update_project(
    id: String,
    payload: UpdateProjectPayload,
    state: State<'_, DbState>,
) -> Result<ProjectDto, CommandError> {
    let conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;
    let current =
        get_project(&conn, &id)?.ok_or_else(|| CommandError::internal("Project not found"))?;
    let description = match payload.description {
        Some(description) => empty_to_none(Some(description)),
        None => current.description,
    };

    conn.execute(
        r#"
        UPDATE projects
        SET name = ?2,
            description = ?3,
            color = ?4,
            is_archived = ?5,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        WHERE id = ?1
        "#,
        params![
            id,
            payload.name.unwrap_or(current.name).trim(),
            description,
            payload.color.or(current.color),
            payload.is_archived.unwrap_or(current.is_archived) as i32
        ],
    )
    .map_command_error("Unable to update project")?;

    get_project(&conn, &id)?.ok_or_else(|| CommandError::internal("Project not found"))
}

#[tauri::command]
pub fn delete_project(id: String, state: State<'_, DbState>) -> Result<ProjectDto, CommandError> {
    let conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;
    let project =
        get_project(&conn, &id)?.ok_or_else(|| CommandError::internal("Project not found"))?;

    conn.execute("DELETE FROM projects WHERE id = ?1", params![id])
        .map_command_error("Unable to delete project")?;

    Ok(project)
}

#[tauri::command]
pub fn archive_project(id: String, state: State<'_, DbState>) -> Result<ProjectDto, CommandError> {
    update_project(
        id,
        UpdateProjectPayload {
            name: None,
            description: None,
            color: None,
            is_archived: Some(true),
        },
        state,
    )
}

#[tauri::command]
pub fn list_projects(
    include_archived: Option<bool>,
    state: State<'_, DbState>,
) -> Result<Vec<ProjectDto>, CommandError> {
    let conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;
    let include_archived = include_archived.unwrap_or(false);
    let sql = if include_archived {
        "SELECT id, name, description, color, is_archived, created_at, updated_at FROM projects ORDER BY is_archived ASC, updated_at DESC, name ASC"
    } else {
        "SELECT id, name, description, color, is_archived, created_at, updated_at FROM projects WHERE is_archived = 0 ORDER BY is_archived ASC, updated_at DESC, name ASC"
    };
    let mut stmt = conn
        .prepare(sql)
        .map_command_error("Unable to list projects")?;
    let projects = stmt
        .query_map([], map_project)
        .map_command_error("Unable to list projects")?
        .collect::<Result<Vec<_>, _>>()
        .map_command_error("Unable to list projects")?;

    Ok(projects)
}

#[tauri::command]
pub fn get_project_by_id(
    id: String,
    state: State<'_, DbState>,
) -> Result<Option<ProjectDto>, CommandError> {
    let conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;

    get_project(&conn, &id)
}

fn get_project(conn: &rusqlite::Connection, id: &str) -> Result<Option<ProjectDto>, CommandError> {
    conn.query_row(
        "SELECT id, name, description, color, is_archived, created_at, updated_at FROM projects WHERE id = ?1",
        params![id],
        map_project,
    )
    .optional()
    .map_command_error("Unable to read project")
}

fn map_project(row: &Row<'_>) -> rusqlite::Result<ProjectDto> {
    Ok(ProjectDto {
        id: row.get("id")?,
        name: row.get("name")?,
        description: row.get("description")?,
        color: row.get("color")?,
        is_archived: row.get::<_, i32>("is_archived")? != 0,
        created_at: row.get("created_at")?,
        updated_at: row.get("updated_at")?,
    })
}

fn empty_to_none(value: Option<String>) -> Option<String> {
    value.and_then(|value| {
        let trimmed = value.trim().to_string();
        if trimmed.is_empty() {
            None
        } else {
            Some(trimmed)
        }
    })
}
