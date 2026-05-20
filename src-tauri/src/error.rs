use serde::Serialize;
use std::fmt;

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

impl fmt::Display for CommandError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(formatter, "{}: {}", self.code, self.message)
    }
}

impl std::error::Error for CommandError {}

pub trait CommandResultExt<T> {
    fn map_command_error(self, message: &'static str) -> Result<T, CommandError>;
}

impl<T, E> CommandResultExt<T> for Result<T, E> {
    fn map_command_error(self, message: &'static str) -> Result<T, CommandError> {
        self.map_err(|_| CommandError::internal(message))
    }
}
