use crate::core::response::ResponseStatus;
use enum_meta::{derive_meta, Meta};
use thiserror::Error;

macro_rules! user_facing_errors {
    ($enum_name: ident, $(($variant:ident, $http_status:expr, $response_status: expr, $code_message:expr),)+) => {
        #[derive(Debug, Error)]
        #[derive_meta(ResponseStatus)]
        pub enum $enum_name {
            $(
                #[meta(($http_status, $response_status, $code_message).into())]
                $variant,
            )*
        }

        impl std::fmt::Display for UserFacingError {
            fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
                write!(f, "{}", self.meta().2)
            }
        }

    };
}

use axum::http::StatusCode;

#[rustfmt::skip]
user_facing_errors!(
    UserFacingError,
    // (Variant, HTTP Status Code, Response Code, Message)
    // Permission Error
    (PermissionError, 4001, "Permission Denied", StatusCode::FORBIDDEN),
    // Other Error
    (UnknownError, 4000, "Bad Request", StatusCode::BAD_REQUEST),
);

impl Default for UserFacingError {
    fn default() -> Self {
        UserFacingError::UnknownError
    }
}
