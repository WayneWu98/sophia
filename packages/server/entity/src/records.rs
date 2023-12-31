//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.10

use super::sea_orm_active_enums::Role;
use super::sea_orm_active_enums::Status;
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "records")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub anchors: Option<Json>,
    #[sea_orm(column_type = "Text")]
    pub content: String,
    pub host: String,
    pub path: String,
    pub parent: Option<i32>,
    pub nickname: String,
    pub email: String,
    pub website: Option<String>,
    pub created: DateTime,
    pub modified: DateTime,
    pub status: Status,
    pub role: Role,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "Entity",
        from = "Column::Parent",
        to = "Column::Id",
        on_update = "NoAction",
        on_delete = "NoAction"
    )]
    SelfRef,
}

impl ActiveModelBehavior for ActiveModel {}
