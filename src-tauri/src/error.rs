use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandError {
    pub code: &'static str,
    pub message: String,
}

impl CommandError {
    pub fn internal(message: impl Into<String>) -> Self {
        Self {
            code: "internal_error",
            message: message.into(),
        }
    }
}

pub fn command_not_configured() -> CommandError {
    CommandError {
        code: "database_unavailable",
        message: "Database-backed Tauri commands are not connected yet".to_string(),
    }
}

pub trait CommandResultExt<T> {
    fn map_command_error(self, message: &'static str) -> Result<T, CommandError>;
}

impl<T, E> CommandResultExt<T> for Result<T, E> {
    fn map_command_error(self, message: &'static str) -> Result<T, CommandError> {
        self.map_err(|_| CommandError::internal(message))
    }
}
