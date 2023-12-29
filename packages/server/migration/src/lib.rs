pub use sea_orm_migration::prelude::*;

mod m20231226_020248_create_table;
mod util;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![Box::new(m20231226_020248_create_table::Migration)]
    }
}
