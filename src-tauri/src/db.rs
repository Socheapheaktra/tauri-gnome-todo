use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Mutex;

use rusqlite::Connection;
use tauri::{AppHandle, Manager};

use crate::error::{CommandError, CommandResultExt};

pub struct DbState {
    pub conn: Mutex<Connection>,
}

impl DbState {
    pub fn connect(app: &AppHandle) -> Result<Self, CommandError> {
        let app_data_dir = app
            .path()
            .app_data_dir()
            .map_command_error("Unable to locate app data directory")?;

        let db_path = database_path(&app_data_dir);

        if let Some(db_dir) = db_path.parent() {
            fs::create_dir_all(db_dir).map_command_error("Unable to create app data directory")?;
        }

        let conn = Connection::open(db_path).map_command_error("Unable to open SQLite database")?;

        conn.pragma_update(None, "foreign_keys", "ON")
            .map_command_error("Unable to enable SQLite foreign keys")?;
        conn.pragma_update(None, "journal_mode", "WAL")
            .map_command_error("Unable to enable SQLite WAL mode")?;

        run_migrations(&conn)?;

        Ok(Self {
            conn: Mutex::new(conn),
        })
    }
}

#[cfg(debug_assertions)]
fn database_path(_app_data_dir: &Path) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join(".dev-data")
        .join("tasks.sqlite3")
}

#[cfg(not(debug_assertions))]
fn database_path(app_data_dir: &Path) -> PathBuf {
    app_data_dir.join("tasks.sqlite3")
}

fn run_migrations(conn: &Connection) -> Result<(), CommandError> {
    conn.execute_batch(
        r#"
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          color TEXT,
          is_archived INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
          updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
        );

        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          project_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT NOT NULL DEFAULT 'todo',
          priority TEXT NOT NULL DEFAULT 'medium',
          due_date TEXT,
          completed_at TEXT,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
          updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          CHECK (status IN ('todo', 'in_progress', 'completed')),
          CHECK (priority IN ('low', 'medium', 'high'))
        );

        CREATE TABLE IF NOT EXISTS app_settings (
          id TEXT PRIMARY KEY,
          key TEXT NOT NULL UNIQUE,
          value TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
          updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
        );

        CREATE INDEX IF NOT EXISTS idx_projects_is_archived ON projects(is_archived);
        CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);
        CREATE INDEX IF NOT EXISTS idx_tasks_project_sort ON tasks(project_id, sort_order);
        CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
        CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
        CREATE INDEX IF NOT EXISTS idx_tasks_completed_at ON tasks(completed_at);
        "#,
    )
    .map_command_error("Unable to migrate SQLite database")
}
