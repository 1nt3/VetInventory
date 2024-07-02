pub mod category_repository;
pub mod product_repository;
pub mod supplier_repository;
pub mod user_repository;

use sqlx::Error as SqlxError;

pub trait Repository<T> {
    async fn find_all(&mut self) -> Result<Vec<T>, SqlxError>;
    async fn find_by_id(&mut self, id: i64) -> Result<Option<T>, SqlxError>;
    async fn create(&mut self, entity: T) -> Result<(), SqlxError>;
    async fn update(&mut self, entity: T) -> Result<(), SqlxError>;
    async fn delete(&mut self, id: i64) -> Result<(), SqlxError>;
}
