use rusqlite::{params, OptionalExtension};
use serde_json::Value;
use tauri::State;
use uuid::Uuid;

use crate::db::DbState;
use crate::error::{CommandError, CommandResultExt};
use crate::models::AppSettingDto;

#[tauri::command]
pub fn get_app_setting(
    key: String,
    state: State<'_, DbState>,
) -> Result<Option<AppSettingDto>, CommandError> {
    let conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;

    conn.query_row(
        "SELECT key, value FROM app_settings WHERE key = ?1",
        params![key],
        |row| {
            let key: String = row.get("key")?;
            let raw_value: String = row.get("value")?;
            let value = serde_json::from_str(&raw_value).unwrap_or(Value::Null);
            Ok(AppSettingDto { key, value })
        },
    )
    .optional()
    .map_command_error("Unable to read setting")
}

#[tauri::command]
pub fn update_app_setting(
    key: String,
    value: Value,
    state: State<'_, DbState>,
) -> Result<AppSettingDto, CommandError> {
    let conn = state
        .conn
        .lock()
        .map_command_error("Unable to access SQLite database")?;
    let raw_value =
        serde_json::to_string(&value).map_command_error("Unable to serialize setting")?;

    conn.execute(
        r#"
        INSERT INTO app_settings (id, key, value)
        VALUES (?1, ?2, ?3)
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        "#,
        params![format!("setting-{}", Uuid::new_v4()), key, raw_value],
    )
    .map_command_error("Unable to update setting")?;

    Ok(AppSettingDto { key, value })
}
