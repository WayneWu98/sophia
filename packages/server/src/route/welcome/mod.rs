use crate::core::response::ResponseBody;

pub async fn hello() -> ResponseBody<&'static str> {
    ResponseBody::ok("Hello, world!")
}
