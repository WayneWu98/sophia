mod user_facing_error;
use axum::{response::IntoResponse, Json};
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
}

pub type Result<T = ()> = std::result::Result<T, AppError>;

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
        todo!("normalize error response");
        let ResponseStatus(http_code, response_code, message) = self.meta();
        let body = ResponseBody {
            data: (),
            code: response_code,
            message,
        };
        // axum::response::Response::builder()
        //     .status(http_code)
        //     .body(Json(body))
    }
}
