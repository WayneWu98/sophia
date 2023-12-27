use sea_orm::{EnumIter, Iterable};
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

const HOST_CHAR_LEN: u32 = 255;
const PATH_CHAR_LEN: u32 = 255;
const NICKNAME_CHAR_LEN: u32 = 32;
const EMAIL_CHAR_LEN: u32 = 32;
const WEBSITE_CHAR_LEN: u32 = 64;

use crate::util;

const RECORD_INDEX: [(Record, &str, IndexType); 5] = [
    (Record::Host, "idx_record_host", IndexType::Hash),
    (Record::Path, "idx_record_path", IndexType::Hash),
    (Record::Email, "idx_record_email", IndexType::Hash),
    (Record::Created, "idx_record_created", IndexType::BTree),
    (Record::Modified, "idx_record_modified", IndexType::BTree),
];
async fn up_record(manager: &SchemaManager<'_>) -> Result<(), DbErr> {
    let create_table_sql = Table::create()
        .table(Record::Table)
        .if_not_exists()
        .col(
            ColumnDef::new(Record::Id)
                .integer()
                .not_null()
                .auto_increment()
                .primary_key(),
        )
        .col(ColumnDef::new(Record::Anchors).json())
        .col(ColumnDef::new(Record::Content).text().not_null())
        .col(
            ColumnDef::new(Record::Host)
                .not_null()
                .char_len(HOST_CHAR_LEN),
        )
        .col(
            ColumnDef::new(Record::Path)
                .not_null()
                .char_len(PATH_CHAR_LEN),
        )
        .col(ColumnDef::new(Record::Parent).integer())
        .col(
            ColumnDef::new(Record::Nickname)
                .char_len(NICKNAME_CHAR_LEN)
                .not_null(),
        )
        .col(
            ColumnDef::new(Record::Email)
                .char_len(EMAIL_CHAR_LEN)
                .not_null(),
        )
        .col(ColumnDef::new(Record::Website).char_len(WEBSITE_CHAR_LEN))
        .col(
            ColumnDef::new(Record::Created)
                .date_time()
                .not_null()
                .default(Expr::current_timestamp()),
        )
        .col(
            ColumnDef::new(Record::Modified)
                .date_time()
                .not_null()
                .default(Expr::current_timestamp()),
        )
        .col(
            ColumnDef::new(Record::Status)
                .enumeration(RecordStatus::Table, RecordStatus::iter().skip(1))
                .not_null()
                .default(Value::String(Some(Box::new(
                    RecordStatus::Draft.to_string(),
                )))),
        )
        .col(
            ColumnDef::new(Record::Role)
                .enumeration(RecordRole::Table, RecordRole::iter().skip(1))
                .not_null()
                .default(Value::String(Some(Box::new(
                    RecordRole::Visitor.to_string(),
                )))),
        )
        .to_owned();
    manager.create_table(create_table_sql.clone()).await?;
    for (col, name, index_type) in RECORD_INDEX.clone().into_iter() {
        util::create_index(manager, Record::Table, name, col.clone(), index_type).await?;
    }
    const FOREIGN_KEY: &str = "fidx_record_parent";
    if !manager
        .has_index(Record::Table.to_string(), FOREIGN_KEY)
        .await?
    {
        manager
            .create_foreign_key(
                ForeignKey::create()
                    .from(Record::Table, Record::Parent)
                    .to(Record::Table, Record::Id)
                    .name(FOREIGN_KEY)
                    .to_owned(),
            )
            .await?;
    }

    Ok(())
}
async fn down_record(manager: &SchemaManager<'_>) -> Result<(), DbErr> {
    for (_, name, _) in RECORD_INDEX.clone().into_iter() {
        crate::util::drop_index(manager, Record::Table, name).await?;
    }
    manager
        .drop_foreign_key(
            ForeignKey::drop()
                .name("fidx_record_parent")
                .table(Record::Table)
                .to_owned(),
        )
        .await?;
    manager
        .drop_table(Table::drop().table(Record::Table).if_exists().to_owned())
        .await?;
    Ok(())
}

const WEBSITE_INDEX: [(Website, &str, IndexType); 2] = [
    (Website::Host, "idx_website_host", IndexType::Hash),
    (Website::Path, "idx_website_path", IndexType::Hash),
];
async fn up_website(manager: &SchemaManager<'_>) -> Result<(), DbErr> {
    let create_table_sql = Table::create()
        .table(Website::Table)
        .if_not_exists()
        .col(
            ColumnDef::new(Website::Id)
                .integer()
                .not_null()
                .auto_increment()
                .primary_key(),
        )
        .col(
            ColumnDef::new(Website::Host)
                .not_null()
                .char_len(HOST_CHAR_LEN),
        )
        .col(
            ColumnDef::new(Website::Path)
                .not_null()
                .char_len(PATH_CHAR_LEN),
        )
        .col(
            ColumnDef::new(Website::Allowed)
                .boolean()
                .not_null()
                .default(false),
        )
        .to_owned();
    manager.create_table(create_table_sql.clone()).await?;

    for (col, name, index_type) in WEBSITE_INDEX.clone().into_iter() {
        util::create_index(manager, Website::Table, name, col.clone(), index_type).await?;
    }
    Ok(())
}
async fn down_website(manager: &SchemaManager<'_>) -> Result<(), DbErr> {
    for (_, name, _) in WEBSITE_INDEX.clone().into_iter() {
        crate::util::drop_index(manager, Website::Table, name).await?;
    }
    manager
        .drop_table(Table::drop().table(Website::Table).if_exists().to_owned())
        .await?;
    Ok(())
}

const OPTION_INDEX: [(AppOption, &str, IndexType); 1] =
    [(AppOption::Key, "idx_option_key", IndexType::Hash)];
async fn up_option(manager: &SchemaManager<'_>) -> Result<(), DbErr> {
    let create_table_sql = Table::create()
        .table(AppOption::Table)
        .if_not_exists()
        .col(
            ColumnDef::new(AppOption::Id)
                .integer()
                .not_null()
                .auto_increment()
                .primary_key(),
        )
        .col(ColumnDef::new(AppOption::Key).char_len(32).not_null())
        .col(ColumnDef::new(AppOption::Value).text())
        .to_owned();
    manager.create_table(create_table_sql.clone()).await?;
    for (col, name, index_type) in OPTION_INDEX.clone().into_iter() {
        util::create_index(manager, AppOption::Table, name, col.clone(), index_type).await?;
    }
    Ok(())
}
async fn down_option(manager: &SchemaManager<'_>) -> Result<(), DbErr> {
    for (_, name, _) in OPTION_INDEX.clone().into_iter() {
        crate::util::drop_index(manager, AppOption::Table, name).await?;
    }
    manager
        .drop_table(Table::drop().table(AppOption::Table).if_exists().to_owned())
        .await?;
    Ok(())
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // create table records
        up_record(manager).await?;
        up_website(manager).await?;
        up_option(manager).await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        down_record(manager).await?;
        down_website(manager).await?;
        down_option(manager).await?;
        Ok(())
    }
}

#[derive(DeriveIden, Clone, Copy)]
enum Record {
    #[sea_orm(iden = "records")]
    Table,
    Id,
    Anchors,
    Content,
    Parent,
    Nickname,
    Email,
    Website,
    Created,
    Modified,
    Status,
    Role,
    Host,
    Path,
}

#[derive(Iden, EnumIter, Clone, Copy)]
pub enum RecordStatus {
    Table,
    #[iden = "published"]
    Published,
    #[iden = "deleted"]
    Deleted,
    #[iden = "draft"]
    Draft,
}

#[derive(Iden, EnumIter, Clone, Copy)]
pub enum RecordRole {
    Table,
    #[iden = "manager"]
    Manager,
    #[iden = "visitor"]
    Visitor,
}

#[derive(DeriveIden, Clone, Copy)]
pub enum Website {
    #[sea_orm(iden = "websites")]
    Table,
    Id,
    Host,
    Path,
    Allowed,
}

#[derive(DeriveIden, Clone, Copy)]
pub enum AppOption {
    #[sea_orm(iden = "options")]
    Table,
    Id,
    Key,
    Value,
}
