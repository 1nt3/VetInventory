pub mod product_repository;

use sqlx::Error as SqlxError;

pub trait Repository<T> {
    async fn find_all(&self) -> Result<Vec<T>, SqlxError>;
    async fn find_by_id(&self, id: u32) -> Result<Option<T>, SqlxError>;
    async fn create(&mut self, entity: T) -> Result<(), SqlxError>;
    async fn update(&self, entity: T) -> Result<(), SqlxError>;
    async fn delete(&self, id: u32) -> Result<(), SqlxError>;
}
