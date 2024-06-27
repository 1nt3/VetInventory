use super::Repository;
use super::SqlxError;
use sqlx::pool::PoolConnection;
use sqlx::Sqlite;

use crate::models::product::Product;

pub struct ProductRepository {
    pool: PoolConnection<Sqlite>,
}

impl ProductRepository {
    pub fn new(pool: PoolConnection<Sqlite>) -> Self {
        Self { pool }
    }
}

impl Repository<Product> for ProductRepository {
    async fn find_all(&self) -> Result<Vec<Product>, SqlxError> {
        /*
        let products = sqlx::query_as::<_, Product>("SELECT * FROM product")
            .fetch_all(&mut *self.pool)
            .await?;*/
        Ok(Vec::new())
    }

    async fn find_by_id(&self, product_id: u32) -> Result<Option<Product>, SqlxError> {
        /*
        let product = sqlx::query_as::<_, Product>("SELECT * FROM product WHERE id = ?")
            .bind(product_id
            .fetch_optional(&self.pool)
            .await?;
        Ok(product)*/
        Ok(None)
    }

    async fn create(&mut self, product: Product) -> Result<(), SqlxError> {
        sqlx::query!(
            "INSERT INTO product (name, description, category_id, supplier_id, price_purchase, price_sell, stock_initial, stock_current) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            product.name,
            product.description,
            product.category_id,
            product.supplier_id,
            product.price_purchase,
            product.price_sell,
            product.stock_initial,
            product.stock_current
        )
        .execute(&mut *self.pool)
        .await?;

        Ok(())
    }

    async fn update(&self, product: Product) -> Result<(), SqlxError> {
        /*
        sqlx::query(
            "UPDATE product
                SET title = ?,
                content = ?,
                password = ?,
                creation_date = ?,
                expire_days = ?,
                link_share = ?
                WHERE id_product = ?;",
        )
        .bind(&product.title)
        .bind(&product.content)
        .bind(&product.password)
        .bind(&product.creation_date)
        .bind(&product.expire_days)
        .bind(&product.link_share)
        .bind(&product.id_product)
        .execute(&self.pool)
        .await?;
        Ok(())
        */
        Ok(())
    }

    async fn delete(&self, product_id: u32) -> Result<(), SqlxError> {
        /*
        sqlx::query("DELETE FROM product WHERE id = ?")
            .bind(product_id)
            .execute(&self.pool)
            .await?;
        Ok(())

        */
        Ok(())
    }
}
