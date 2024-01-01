mod user_facing_error;
use axum::{http::StatusCode, response::IntoResponse, Json};
pub use user_facing_error::UserFacingError;

use config::ConfigError;
use enum_meta::{derive_meta, Meta};
use thiserror::Error;

use super::response::{ResponseBody, ResponseStatus};

#[derive(Debug, Error)]
#[derive_meta(ResponseStatus)]
pub enum AppError {
    #[error("IO error occurred: {0}")]
    #[meta(ResponseStatus::internal_error())]
    IOError(#[from] std::io::Error),

    #[error("DB error occurred: {0}")]
    #[meta(ResponseStatus::internal_error())]
    DBError(#[from] sea_orm::DbErr),

    #[error("Serialize error occurred: {0}")]
    #[meta(ResponseStatus::internal_error())]
    SerdeError(#[from] serde_json::Error),

    #[error(transparent)]
    #[meta(self.0.meta())]
    UserFacingError(#[from] UserFacingError),

    #[error("Unknown error occurred: {0}")]
    #[meta(ResponseStatus::internal_error())]
    UnknownError(String),

    #[error("Config error occurred: {0}")]
    #[meta(ResponseStatus::internal_error())]
    ConfigError(String),
}

pub type AppResult<T = ()> = std::result::Result<T, AppError>;

impl From<&str> for AppError {
    fn from(value: &str) -> Self {
        AppError::UnknownError(value.to_owned())
    }
}

impl From<ConfigError> for AppError {
    fn from(value: ConfigError) -> Self {
        AppError::UnknownError(value.to_string())
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        let ResponseStatus(response_code, message, status_code) = self.meta();
        (
            status_code,
            Json(ResponseBody::error(response_code, message)),
        )
            .into_response()
    }
}
