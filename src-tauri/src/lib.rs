mod commands;
mod error;
mod models;

use commands::projects::{
    archive_project, create_project, delete_project, get_project_by_id, list_projects,
    update_project,
};
use commands::settings::{get_app_setting, update_app_setting, SettingsState};
use commands::tasks::{
    complete_task, create_task, delete_task, list_overdue_tasks, list_tasks_by_project,
    list_today_tasks, reopen_task, reorder_tasks, update_task,
};

#[tauri::command]
fn app_health() -> &'static str {
    "ok"
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(SettingsState::default())
        .invoke_handler(tauri::generate_handler![
            app_health,
            create_project,
            update_project,
            delete_project,
            archive_project,
            list_projects,
            get_project_by_id,
            create_task,
            update_task,
            delete_task,
            complete_task,
            reopen_task,
            list_tasks_by_project,
            list_today_tasks,
            list_overdue_tasks,
            reorder_tasks,
            get_app_setting,
            update_app_setting
        ])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
