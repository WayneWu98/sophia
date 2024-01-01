use serde::Deserialize;
use tracing::Level;

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

#[derive(Debug)]
pub struct LogConfig {
    pub level: Level,
    pub path: Option<String>,
}

impl<'de> Deserialize<'de> for LogConfig {
    fn deserialize<D>(deserializer: D) -> result::Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let map: HashMap<String, String> = Deserialize::deserialize(deserializer)?;
        let level = Level::from_str(&map.get("level").unwrap_or(&"error".to_owned()))
            .map_err(|_| serde::de::Error::custom("Invalid log level"))?;
        #[cfg(env = "production")]
        if level < Level::INFO {
            return Err(serde::de::Error::invalid_value(
                level,
                "Info | Warn | Error",
            ));
        }
        Ok(LogConfig {
            level,
            path: map.get("path").and_then(|v| Some(v.to_owned())),
        })
    }
}

#[derive(Deserialize, Debug)]
pub struct AppConfig {
    pub server: ServerConfig,
    pub jwt: JWTConfig,
    pub db: DBConfig,
    pub log: LogConfig,
}
use std::{collections::HashMap, fmt::Debug, result, str::FromStr};

use once_cell::sync::OnceCell;

use crate::AppResult;

static APP_CONFIG: OnceCell<AppConfig> = OnceCell::new();

impl AppConfig {
    pub fn global() -> &'static AppConfig {
        APP_CONFIG.get().expect("AppConfig not initialized")
    }
    pub fn set_global(config: AppConfig) -> AppResult<()> {
        APP_CONFIG
            .set(config)
            .map_err(|_| "AppConfig already initialized")?;
        Ok(())
    }
    pub fn from_source(s: &str, format: config::FileFormat) -> AppResult<AppConfig> {
        Ok(config::Config::builder()
            .add_source(config::File::from_str(s, format))
            .build()?
            .try_deserialize()?)
    }
    pub fn from_file(path: &str) -> AppResult<AppConfig> {
        Ok(config::Config::builder()
            .add_source(config::File::with_name(path))
            .build()?
            .try_deserialize()?)
    }
    pub fn from_env() -> AppResult<AppConfig> {
        todo!()
    }
}
