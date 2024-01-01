use axum::{
    http::StatusCode,
    response::{self, IntoResponse},
    Json,
};
use enum_meta::Meta;
use serde::Serialize;

use super::error::UserFacingError;

#[derive(Serialize, Debug, Default)]
pub struct ResponseCode(i32);

#[rustfmt::skip]
#[derive(Debug)]
/**
 * ResponseStatus is a tuple of (http_status, response_status, message)
 */
pub struct ResponseStatus(
    /** Response Code */
    pub ResponseCode,
    /** Message */ 
    pub String,
    /** HTTP Status */
    pub StatusCode,
);

impl Default for ResponseStatus {
    fn default() -> Self {
        ResponseStatus(ResponseCode(0), "OK".to_owned(), StatusCode::OK)
    }
}

impl ResponseStatus {
    pub fn internal_error() -> Self {
        ResponseStatus(
            ResponseCode(5000),
            "Internal Error".to_owned(),
            StatusCode::INTERNAL_SERVER_ERROR,
        )
    }
}

impl From<UserFacingError> for ResponseStatus {
    fn from(value: UserFacingError) -> Self {
        value.meta().into()
    }
}

impl From<(i32, &str, StatusCode)> for ResponseStatus {
    fn from(value: (i32, &str, StatusCode)) -> Self {
        ResponseStatus(ResponseCode(value.0), value.1.to_owned(), value.2)
    }
}

#[derive(Serialize, Debug, Default)]
pub struct ResponseBody<T>
where
    T: Serialize,
{
    pub data: T,
    pub code: ResponseCode,
    pub message: String,
}

impl<T: Serialize> ResponseBody<T> {
    pub fn ok(data: T) -> Self {
        ResponseBody {
            data,
            code: ResponseCode(0),
            message: "OK".to_owned(),
        }
    }
}

impl ResponseBody<()> {
    pub fn error(code: ResponseCode, message: String) -> Self {
        ResponseBody {
            data: (),
            code,
            message,
        }
    }
}

#[derive(Serialize, Debug, Default)]
pub struct PaginationData<T>
where
    T: Serialize,
{
    pub items: Vec<T>,
    pub total: usize,
}

pub type Result<T> = crate::AppResult<ResponseBody<T>>;

impl<T: Serialize> IntoResponse for ResponseBody<T> {
    fn into_response(self) -> response::Response {
        Json(self).into_response()
    }
}

impl<T: Serialize> From<T> for ResponseBody<T> {
    fn from(value: T) -> Self {
        ResponseBody::ok(value)
    }
}
