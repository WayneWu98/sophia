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
    () => {};
}

user_facing_errors!(
    UserFacingError,
    (PermissionError, 401, 4001, "Permission Denied"),
    (UnknownError, 400, 4000, "Bad Request"),
);

impl Default for UserFacingError {
    fn default() -> Self {
        UserFacingError::UnknownError
    }
}
