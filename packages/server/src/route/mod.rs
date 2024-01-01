use axum::{Extension, Router};

pub mod welcome;

use crate::core::state::AppState;

pub fn app(state: AppState) -> Router {
    Router::new()
        .nest("/welcome", welcome::router())
        .layer(Extension(std::sync::Arc::new(state)))
}
