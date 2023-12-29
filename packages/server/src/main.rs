use clap::Parser;

use sophia::{
    core::{self, error::Result, global::AppConfig, state::AppState},
    db::connect_db,
    route::router,
};

#[tokio::main]
async fn main() -> Result<()> {
    let cli = core::cli::Cli::parse();
    let config = AppConfig::from_file(&cli.config)?;
    AppConfig::set_global(config).expect("global config set failed");
    let app_config = AppConfig::global();
    let db = connect_db(&app_config.db).await?;
    let app_state = AppState { db };
    // app_config.server.port.unwrap_or(default)
    let addr = format!(
        "{host}:{port}",
        host = app_config.server.host,
        port = app_config.server.port.unwrap_or(0)
    );
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, router(app_state)).await?;
    Ok(())
}
