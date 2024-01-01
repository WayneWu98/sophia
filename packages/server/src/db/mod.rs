use crate::core::{error::AppResult, global::DBConfig};

pub async fn connect_db(config: &DBConfig) -> AppResult<sea_orm::DatabaseConnection> {
    let mut opt = sea_orm::ConnectOptions::new(config.url.clone());
    opt.max_connections(config.max_connections);
    Ok(sea_orm::Database::connect(opt).await?)
}
