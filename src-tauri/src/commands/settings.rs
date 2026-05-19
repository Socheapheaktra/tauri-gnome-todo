use std::collections::HashMap;
use std::sync::Mutex;

use serde_json::Value;
use tauri::State;

use crate::error::{CommandError, CommandResultExt};
use crate::models::AppSettingDto;

#[derive(Default)]
pub struct SettingsState {
    settings: Mutex<HashMap<String, Value>>,
}

#[tauri::command]
pub fn get_app_setting(
    key: String,
    state: State<'_, SettingsState>,
) -> Result<Option<AppSettingDto>, CommandError> {
    let settings = state
        .settings
        .lock()
        .map_command_error("Unable to read settings")?;

    Ok(settings
        .get(&key)
        .cloned()
        .map(|value| AppSettingDto { key, value }))
}

#[tauri::command]
pub fn update_app_setting(
    key: String,
    value: Value,
    state: State<'_, SettingsState>,
) -> Result<AppSettingDto, CommandError> {
    let mut settings = state
        .settings
        .lock()
        .map_command_error("Unable to update settings")?;

    settings.insert(key.clone(), value.clone());

    Ok(AppSettingDto { key, value })
}
