use rusqlite::{params, OptionalExtension, Row};
use tauri::State;
use uuid::Uuid;

use crate::db::DbState;
use crate::error::{CommandError, CommandResultExt};
use crate::models::{
    CreateTaskPayload, ProjectDto, ReorderTaskPayload, TaskDto, TaskPriorityDto, TaskStatusDto,
    TaskWithProjectDto, UpdateTaskPayload,
};

#[tauri::command]
pub fn create_task(
    payload: CreateTaskPayload,
    state: State<'_, DbState>,
) -> Result<TaskDto, CommandError> {
    let id = format!("task-{}", Uuid::new_v4());
    let conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;

    conn.execute(
        r#"
        INSERT INTO tasks (id, project_id, title, description, priority, due_date, sort_order)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
        "#,
        params![
            id,
            payload.project_id,
            payload.title.trim(),
            empty_to_none(payload.description),
            payload.priority.unwrap_or(TaskPriorityDto::Medium).as_str(),
            empty_to_none(payload.due_date),
            payload.sort_order.unwrap_or(0)
        ],
    )
    .map_command_error("Unable to create task")?;

    get_task(&conn, &id)?.ok_or_else(|| CommandError::internal("Task was not created"))
}

#[tauri::command]
pub fn update_task(
    id: String,
    payload: UpdateTaskPayload,
    state: State<'_, DbState>,
) -> Result<TaskDto, CommandError> {
    let conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;
    let current = get_task(&conn, &id)?.ok_or_else(|| CommandError::internal("Task not found"))?;
    let description = match payload.description {
        Some(description) => empty_to_none(Some(description)),
        None => current.description,
    };
    let due_date = match payload.due_date {
        Some(due_date) => empty_to_none(Some(due_date)),
        None => current.due_date,
    };
    let next_status = payload.status.unwrap_or(current.status);
    let next_completed_at = if matches!(next_status, TaskStatusDto::Completed) {
        match payload.completed_at {
            Some(completed_at) => empty_to_none(Some(completed_at)),
            None => current.completed_at.or_else(|| {
                conn.query_row("SELECT strftime('%Y-%m-%dT%H:%M:%fZ', 'now')", [], |row| {
                    row.get(0)
                })
                .ok()
            }),
        }
    } else {
        None
    };

    conn.execute(
        r#"
        UPDATE tasks
        SET project_id = ?2,
            title = ?3,
            description = ?4,
            status = ?5,
            priority = ?6,
            due_date = ?7,
            completed_at = ?8,
            sort_order = ?9,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        WHERE id = ?1
        "#,
        params![
            id,
            payload.project_id.unwrap_or(current.project_id),
            payload.title.unwrap_or(current.title).trim(),
            description,
            next_status.as_str(),
            payload.priority.unwrap_or(current.priority).as_str(),
            due_date,
            next_completed_at,
            payload.sort_order.unwrap_or(current.sort_order)
        ],
    )
    .map_command_error("Unable to update task")?;

    get_task(&conn, &id)?.ok_or_else(|| CommandError::internal("Task not found"))
}

#[tauri::command]
pub fn delete_task(id: String, state: State<'_, DbState>) -> Result<TaskDto, CommandError> {
    let conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;
    let task = get_task(&conn, &id)?.ok_or_else(|| CommandError::internal("Task not found"))?;

    conn.execute("DELETE FROM tasks WHERE id = ?1", params![id])
        .map_command_error("Unable to delete task")?;

    Ok(task)
}

#[tauri::command]
pub fn complete_task(id: String, state: State<'_, DbState>) -> Result<TaskDto, CommandError> {
    update_task(
        id,
        UpdateTaskPayload {
            project_id: None,
            title: None,
            description: None,
            status: Some(TaskStatusDto::Completed),
            priority: None,
            due_date: None,
            completed_at: None,
            sort_order: None,
        },
        state,
    )
}

#[tauri::command]
pub fn reopen_task(id: String, state: State<'_, DbState>) -> Result<TaskDto, CommandError> {
    update_task(
        id,
        UpdateTaskPayload {
            project_id: None,
            title: None,
            description: None,
            status: Some(TaskStatusDto::Todo),
            priority: None,
            due_date: None,
            completed_at: None,
            sort_order: None,
        },
        state,
    )
}

#[tauri::command]
pub fn list_tasks_by_project(
    project_id: String,
    state: State<'_, DbState>,
) -> Result<Vec<TaskDto>, CommandError> {
    let conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;
    let mut stmt = conn
        .prepare(
            r#"
            SELECT id, project_id, title, description, status, priority, due_date,
                   completed_at, sort_order, created_at, updated_at
            FROM tasks
            WHERE project_id = ?1
            ORDER BY sort_order ASC, created_at ASC
            "#,
        )
        .map_command_error("Unable to list project tasks")?;

    let tasks = stmt
        .query_map(params![project_id], map_task)
        .map_command_error("Unable to list project tasks")?
        .collect::<Result<Vec<_>, _>>()
        .map_command_error("Unable to list project tasks")?;

    Ok(tasks)
}

#[tauri::command]
pub fn list_today_tasks(
    state: State<'_, DbState>,
) -> Result<Vec<TaskWithProjectDto>, CommandError> {
    let conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;

    list_task_with_project(
        &conn,
        r#"
        WHERE projects.is_archived = 0
          AND tasks.status != 'completed'
          AND tasks.due_date = date('now', 'localtime')
        ORDER BY tasks.sort_order ASC, tasks.created_at ASC
        "#,
    )
}

#[tauri::command]
pub fn list_overdue_tasks(
    state: State<'_, DbState>,
) -> Result<Vec<TaskWithProjectDto>, CommandError> {
    let conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;

    list_task_with_project(
        &conn,
        r#"
        WHERE projects.is_archived = 0
          AND tasks.status != 'completed'
          AND tasks.due_date < date('now', 'localtime')
        ORDER BY tasks.due_date ASC, tasks.sort_order ASC, tasks.created_at ASC
        "#,
    )
}

#[tauri::command]
pub fn reorder_tasks(
    tasks: Vec<ReorderTaskPayload>,
    state: State<'_, DbState>,
) -> Result<Vec<TaskDto>, CommandError> {
    let mut conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;
    let transaction = conn
        .transaction()
        .map_command_error("Unable to reorder tasks")?;

    for task in &tasks {
        transaction
            .execute(
                r#"
                UPDATE tasks
                SET sort_order = ?2,
                    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
                WHERE id = ?1
                "#,
                params![task.id, task.sort_order],
            )
            .map_command_error("Unable to reorder tasks")?;
    }

    transaction
        .commit()
        .map_command_error("Unable to reorder tasks")?;

    let mut updated_tasks = Vec::with_capacity(tasks.len());
    for task in tasks {
        if let Some(updated) = get_task(&conn, &task.id)? {
            updated_tasks.push(updated);
        }
    }

    Ok(updated_tasks)
}

#[tauri::command]
pub fn list_all_tasks(state: State<'_, DbState>) -> Result<Vec<TaskDto>, CommandError> {
    let conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;

    list_tasks(&conn)
}

fn list_tasks(conn: &rusqlite::Connection) -> Result<Vec<TaskDto>, CommandError> {
    let mut stmt = conn
        .prepare(
            r#"
            SELECT id, project_id, title, description, status, priority, due_date,
                   completed_at, sort_order, created_at, updated_at
            FROM tasks
            ORDER BY sort_order ASC, created_at ASC
            "#,
        )
        .map_command_error("Unable to list tasks")?;

    let tasks = stmt
        .query_map([], map_task)
        .map_command_error("Unable to list tasks")?
        .collect::<Result<Vec<_>, _>>()
        .map_command_error("Unable to list tasks")?;

    Ok(tasks)
}

fn get_task(conn: &rusqlite::Connection, id: &str) -> Result<Option<TaskDto>, CommandError> {
    conn.query_row(
        r#"
        SELECT id, project_id, title, description, status, priority, due_date,
               completed_at, sort_order, created_at, updated_at
        FROM tasks
        WHERE id = ?1
        "#,
        params![id],
        map_task,
    )
    .optional()
    .map_command_error("Unable to read task")
}

fn list_task_with_project(
    conn: &rusqlite::Connection,
    where_and_order: &str,
) -> Result<Vec<TaskWithProjectDto>, CommandError> {
    let sql = format!(
        r#"
        SELECT
          tasks.id AS task_id,
          tasks.project_id,
          tasks.title,
          tasks.description,
          tasks.status,
          tasks.priority,
          tasks.due_date,
          tasks.completed_at,
          tasks.sort_order,
          tasks.created_at AS task_created_at,
          tasks.updated_at AS task_updated_at,
          projects.id AS project_id_value,
          projects.name AS project_name,
          projects.description AS project_description,
          projects.color AS project_color,
          projects.is_archived,
          projects.created_at AS project_created_at,
          projects.updated_at AS project_updated_at
        FROM tasks
        INNER JOIN projects ON projects.id = tasks.project_id
        {where_and_order}
        "#
    );
    let mut stmt = conn
        .prepare(&sql)
        .map_command_error("Unable to list smart-view tasks")?;

    let tasks = stmt
        .query_map([], |row| {
            Ok(TaskWithProjectDto {
                task: TaskDto {
                    id: row.get("task_id")?,
                    project_id: row.get("project_id")?,
                    title: row.get("title")?,
                    description: row.get("description")?,
                    status: TaskStatusDto::from_db(row.get("status")?),
                    priority: TaskPriorityDto::from_db(row.get("priority")?),
                    due_date: row.get("due_date")?,
                    completed_at: row.get("completed_at")?,
                    sort_order: row.get("sort_order")?,
                    created_at: row.get("task_created_at")?,
                    updated_at: row.get("task_updated_at")?,
                },
                project: ProjectDto {
                    id: row.get("project_id_value")?,
                    name: row.get("project_name")?,
                    description: row.get("project_description")?,
                    color: row.get("project_color")?,
                    is_archived: row.get::<_, i32>("is_archived")? != 0,
                    created_at: row.get("project_created_at")?,
                    updated_at: row.get("project_updated_at")?,
                },
            })
        })
        .map_command_error("Unable to list smart-view tasks")?
        .collect::<Result<Vec<_>, _>>()
        .map_command_error("Unable to list smart-view tasks")?;

    Ok(tasks)
}

fn map_task(row: &Row<'_>) -> rusqlite::Result<TaskDto> {
    Ok(TaskDto {
        id: row.get("id")?,
        project_id: row.get("project_id")?,
        title: row.get("title")?,
        description: row.get("description")?,
        status: TaskStatusDto::from_db(row.get("status")?),
        priority: TaskPriorityDto::from_db(row.get("priority")?),
        due_date: row.get("due_date")?,
        completed_at: row.get("completed_at")?,
        sort_order: row.get("sort_order")?,
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
