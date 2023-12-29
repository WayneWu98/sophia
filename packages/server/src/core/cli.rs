use clap::Parser;

#[derive(Debug, Parser)]
// #[command(name = "sophia", bin_name = "sophia")]
#[command(author = "Wayne Wu", version = env!("CARGO_PKG_VERSION"), about, long_about = None)]
pub struct Cli {
    #[arg(
        short,
        long,
        default_value = "config.toml",
        help = "path to the config file"
    )]
    pub config: String,
}
