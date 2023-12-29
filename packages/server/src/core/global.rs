use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct JWTConfig {
    pub secret: String,
    pub expiration: u64,
}

fn default_max_connections() -> u32 {
    8
}

#[derive(Deserialize, Debug)]
pub struct DBConfig {
    pub url: String,
    #[serde(default = "default_max_connections")]
    pub max_connections: u32,
}

fn default_host() -> String {
    "0.0.0.0".to_string()
}

#[derive(Deserialize, Debug)]
pub struct ServerConfig {
    #[serde(default = "default_host")]
    pub host: String,
    pub port: Option<u16>,
}

#[derive(Deserialize, Debug)]
pub struct AppConfig {
    pub server: ServerConfig,
    pub jwt: JWTConfig,
    pub db: DBConfig,
}
use std::fmt::Debug;

use once_cell::sync::OnceCell;

use super::error::Result;

static APP_CONFIG: OnceCell<AppConfig> = OnceCell::new();

impl AppConfig {
    pub fn global() -> &'static AppConfig {
        APP_CONFIG.get().expect("AppConfig not initialized")
    }
    pub fn set_global(config: AppConfig) -> Result<()> {
        APP_CONFIG
            .set(config)
            .map_err(|_| "AppConfig already initialized")?;
        Ok(())
    }
    pub fn from_source(s: &str, format: config::FileFormat) -> Result<AppConfig> {
        Ok(config::Config::builder()
            .add_source(config::File::from_str(s, format))
            .build()?
            .try_deserialize()?)
    }
    pub fn from_file(path: &str) -> Result<AppConfig> {
        Ok(config::Config::builder()
            .add_source(config::File::with_name(path))
            .build()?
            .try_deserialize()?)
    }
    pub fn from_env() -> Result<AppConfig> {
        todo!()
    }
}
