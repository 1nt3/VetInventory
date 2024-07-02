use super::Repository;
use super::SqlxError;
use sqlx::pool::PoolConnection;
use sqlx::Sqlite;

use crate::models::category::Category;

pub struct CategoryRepository {
    pool: PoolConnection<Sqlite>,
}

impl CategoryRepository {
    pub fn new(pool: PoolConnection<Sqlite>) -> Self {
        Self { pool }
    }
}

impl Repository<Category> for CategoryRepository {
    async fn find_all(&mut self) -> Result<Vec<Category>, SqlxError> {
        let categories = sqlx::query_as!(Category, "SELECT * FROM category")
            .fetch_all(&mut *self.pool)
            .await?;

        Ok(categories)
    }

    async fn find_by_id(&mut self, category_id: i64) -> Result<Option<Category>, SqlxError> {
        let category =
            sqlx::query_as!(Category, "SELECT * FROM category WHERE id = ?", category_id)
                .fetch_optional(&mut *self.pool)
                .await?;
        Ok(category)
    }

    async fn create(&mut self, category: Category) -> Result<(), SqlxError> {
        sqlx::query!("INSERT INTO category (name) VALUES (?)", category.name,)
            .execute(&mut *self.pool)
            .await?;

        Ok(())
    }

    async fn update(&mut self, category: Category) -> Result<(), SqlxError> {
        sqlx::query!(
            "UPDATE category SET name = ? WHERE id = ?",
            category.name,
            category.id
        )
        .execute(&mut *self.pool)
        .await?;

        Ok(())
    }

    async fn delete(&mut self, category_id: i64) -> Result<(), SqlxError> {
        sqlx::query!("DELETE FROM category WHERE id = ?", category_id)
            .execute(&mut *self.pool)
            .await?;

        Ok(())
    }
}
