use std::str::FromStr;

use sqlx::error::Error;
use sqlx::migrate::Migrator;
use sqlx::sqlite::SqliteConnectOptions;
use sqlx::sqlite::SqlitePool;

const DB_URL: &str = "sqlite://sqlite.db";
static MIGRATOR: Migrator = sqlx::migrate!();

pub struct Database {
    pub pool: SqlitePool,
}

impl Database {
    pub async fn connect() -> Result<Self, Error> {
        let connect_options = SqliteConnectOptions::from_str(DB_URL)?.create_if_missing(true);
        let pool = SqlitePool::connect_with(connect_options).await?;
        Ok(Database { pool })
    }

    pub async fn migrate(&self) -> Result<(), Error> {
        MIGRATOR.run(&self.pool).await?;
        Ok(())
    }

    /*
    pub fn get_pool(&self) -> &SqlitePool {
        &self.pool
    }*/
}
