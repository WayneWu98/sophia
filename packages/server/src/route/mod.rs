use axum::{Extension, Router};

pub mod welcome;

use crate::core::state::AppState;

pub fn router(state: AppState) -> Router {
    Router::new().layer(Extension(std::sync::Arc::new(state)))
}
