use axum::{routing::get, Router};

pub async fn hello() -> crate::ResponseResult<&'static str> {
    Ok("Hello, world!".into())
}

pub fn router() -> Router {
    Router::new().route("/", get(hello))
}
