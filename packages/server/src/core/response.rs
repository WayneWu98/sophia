use enum_meta::Meta;
use serde::Serialize;

use super::error::UserFacingError;

#[derive(Serialize, Debug, Default)]
pub struct ResponseCode(i32);

#[derive(Serialize, Debug)]
/**
 * ResponseStatus is a tuple of (http_code, response_code, message)
 */
pub struct ResponseStatus(
    /** HTTP Status */ pub u16,
    /** Response Code */ pub ResponseCode,
    /** Message */ pub String,
);

impl Default for ResponseStatus {
    fn default() -> Self {
        ResponseStatus(200, ResponseCode(0), "OK".to_owned())
    }
}

impl ResponseStatus {
    pub fn internal_error() -> Self {
        ResponseStatus(500, ResponseCode(5000), "Internal Error".to_owned())
    }
}

impl From<UserFacingError> for ResponseStatus {
    fn from(value: UserFacingError) -> Self {
        value.meta().into()
    }
}

impl From<(u16, usize, &str)> for ResponseStatus {
    fn from(value: (u16, usize, &str)) -> Self {
        ResponseStatus(
            value.0 as u16,
            ResponseCode(value.1 as i32),
            value.2.to_owned(),
        )
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

#[derive(Serialize, Debug, Default)]
pub struct PaginationData<T>
where
    T: Serialize,
{
    pub items: Vec<T>,
    pub total: usize,
}
