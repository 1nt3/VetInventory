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
    async fn find_all(&mut self) -> Result<Vec<Product>, SqlxError> {
        let products = sqlx::query_as!(Product, "SELECT * FROM product")
            .fetch_all(&mut *self.pool)
            .await?;

        Ok(products)
    }

    async fn find_by_id(&mut self, product_id: i64) -> Result<Option<Product>, SqlxError> {
        let product = sqlx::query_as!(Product, "SELECT * FROM product WHERE id = ?", product_id)
            .fetch_optional(&mut *self.pool)
            .await?;
        Ok(product)
    }

    async fn create(&mut self, product: Product) -> Result<Product, SqlxError> {
        let result = sqlx::query_as!(
            Product,
            "INSERT INTO product (name, description, category_id, supplier_id, price_purchase, price_sell, stock_initial, stock_current, utility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id, name, description, category_id, supplier_id, price_purchase, price_sell, stock_initial, stock_current, utility",
            product.name,
            product.description,
            product.category_id,
            product.supplier_id,
            product.price_purchase,
            product.price_sell,
            product.stock_initial,
            product.stock_current,
            product.utility
        )
        .fetch_one(&mut *self.pool)
        .await?;

        Ok(result)
    }

    async fn update(&mut self, product: Product) -> Result<(), SqlxError> {
        sqlx::query!(
            "UPDATE product SET name = ?, description = ?, category_id = ?, supplier_id = ?, price_purchase = ?, price_sell = ?, stock_initial = ?, stock_current = ?, utility = ? WHERE id = ?",
            product.name,
            product.description,
            product.category_id,
            product.supplier_id,
            product.price_purchase,
            product.price_sell,
            product.stock_initial,
            product.stock_current,
            product.utility,
            product.id
        )
        .execute(&mut *self.pool)
        .await?;

        Ok(())
    }

    async fn delete(&mut self, product_id: i64) -> Result<(), SqlxError> {
        sqlx::query!("DELETE FROM product WHERE id = ?", product_id)
            .execute(&mut *self.pool)
            .await?;

        Ok(())
    }
}
