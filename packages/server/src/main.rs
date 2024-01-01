use clap::Parser;

use migration::{Migrator, MigratorTrait};
use sophia::{
    core::{self, error::AppResult, global::AppConfig, state::AppState},
    db::connect_db,
    route::app,
};

#[tokio::main]
async fn main() -> AppResult<()> {
    let cli = core::cli::Cli::parse();
    let config = AppConfig::from_file(&cli.config)?;
    AppConfig::set_global(config).expect("global config set failed");
    let config = AppConfig::global();

    tracing_subscriber::fmt()
        .compact()
        .with_target(false)
        .init();

    let db = connect_db(&config.db).await?;
    Migrator::up(&db, None).await?;

    let app_state = AppState { db };
    // app_config.server.port.unwrap_or(default)
    let addr = format!(
        "{host}:{port}",
        host = config.server.host,
        port = config.server.port.unwrap_or(0)
    );
    let listener = tokio::net::TcpListener::bind(addr).await?;
    tracing::info!("Listening on {}", listener.local_addr()?);
    axum::serve(listener, app(app_state)).await?;
    Ok(())
}
