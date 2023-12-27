use sea_orm_migration::{
    sea_query::{Iden, Index, IndexType, IntoIndexColumn, IntoTableRef},
    DbErr, SchemaManager,
};

pub async fn drop_index<T: IntoTableRef + Iden + Clone + Copy>(
    manager: &SchemaManager<'_>,
    table: T,
    name: &str,
) -> Result<(), DbErr> {
    let table_name = table.to_string();
    if manager.has_index(table_name, name).await? {
        manager
            .drop_index(Index::drop().table(table).name(name).to_owned())
            .await?;
    }
    Ok(())
}

pub async fn create_index<T: Iden + IntoTableRef + Clone + Copy, C: IntoIndexColumn>(
    manager: &SchemaManager<'_>,
    table: T,
    name: &'_ str,
    col: C,
    index_type: IndexType,
) -> Result<(), DbErr> {
    if !manager.has_index(table.to_string(), name).await? {
        manager
            .create_index(
                Index::create()
                    .name(name)
                    .table(table)
                    .index_type(index_type)
                    .col(col)
                    .to_owned(),
            )
            .await?;
    }
    Ok(())
}
