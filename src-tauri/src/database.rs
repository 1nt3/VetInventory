use std::str::FromStr;
use std::sync::Arc;

use sqlx::error::Error;
//use sqlx::migrate::Migrator;
use sqlx::sqlite::SqliteConnectOptions;
use sqlx::sqlite::SqlitePool;
use tauri::async_runtime::Mutex;
//use tokio::sync::Mutex;

const DB_URL: &str = "sqlite://database/sqlite.db";

pub struct Database {
    pool: Arc<Mutex<SqlitePool>>,
}

impl Database {
    pub async fn connect() -> Result<Self, Error> {
        let connect_options = SqliteConnectOptions::from_str(DB_URL)?;
        let pool_sqlite = SqlitePool::connect_with(connect_options).await?;

        Ok(Database {
            pool: Arc::new(Mutex::new(pool_sqlite)),
        })
    }

    pub async fn get_connection(&self) -> sqlx::Result<sqlx::pool::PoolConnection<sqlx::Sqlite>> {
        let pool = self.pool.lock().await;
        pool.acquire().await
    }
}
