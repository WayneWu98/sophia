// use crate::core::{self, error::AppError};
// use axum::{
//     async_trait,
//     extract::{FromRequest, RequestParts, TypedHeader},
//     headers::{authorization::Bearer, Authorization},
// };
// use jsonwebtoken::{decode, errors::ErrorKind, DecodingKey, EncodingKey, Validation};
// use once_cell::sync::Lazy;
// use serde::{Deserialize, Serialize};

// pub struct Key {
//     pub encoding: EncodingKey,
//     pub decoding: DecodingKey,
// }

// impl Key {
//     fn new(secret: &[u8]) -> Self {
//         Self {
//             encoding: EncodingKey::from_secret(secret),
//             decoding: DecodingKey::from_secret(secret),
//         }
//     }
// }

// pub static KEY: Lazy<Key> =
//     Lazy::new(|| Key::new(core::global::AppConfig::global().jwt.secret.as_bytes()));

// #[derive(Debug, Serialize, Deserialize)]
// pub struct Claims {
//     pub email: String,
//     pub nickname: String,
//     pub exp: i64,
// }

// #[async_trait]
// impl<T: Send + Sync> FromRequest<T> for Claims {
//     type Rejection = AppError;
// }

// // pub struct WeekClaims {
// //     pub claims: Option<Claims>,
// // }

// // impl WeekClaims {
// //     pub fn authorized(&self) -> bool {
// //         self.claims.is_some()
// //     }
// // }

// // #[async_trait]
// // impl<T: Send + Sync> FromRequest<T> for WeekClaims {
// //     type Rejection = AppError;

// //     async fn from_request(req: &mut RequestParts<T>) -> Result<Self, Self::Rejection> {
// //         match Claims::from_request(req).await {
// //             Ok(claims) => Ok(Self {
// //                 claims: Some(claims),
// //             }),
// //             Err(_) => Ok(Self { claims: None }),
// //         }
// //     }
// // }
