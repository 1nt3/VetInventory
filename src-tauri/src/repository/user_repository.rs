use crate::models::user::User;

use super::Repository;
use super::SqlxError;
use sqlx::pool::PoolConnection;
use sqlx::Sqlite;

pub struct UserRepository {
    pool: PoolConnection<Sqlite>,
}

impl UserRepository {
    pub fn new(pool: PoolConnection<Sqlite>) -> Self {
        Self { pool }
    }
}

impl Repository<User> for UserRepository {
    async fn find_all(&mut self) -> Result<Vec<User>, SqlxError> {
        let users = sqlx::query_as!(User, "SELECT * FROM user")
            .fetch_all(&mut *self.pool)
            .await?;

        Ok(users)
    }

    async fn find_by_id(&mut self, user_id: i64) -> Result<Option<User>, SqlxError> {
        let user = sqlx::query_as!(User, "SELECT * FROM user WHERE id = ?", user_id)
            .fetch_optional(&mut *self.pool)
            .await?;
        Ok(user)
    }

    async fn create(&mut self, user: User) -> Result<User, SqlxError> {
        let result = sqlx::query_as!(
            User,
            "INSERT INTO user (email, password) VALUES (?, ?) RETURNING id, email, password",
            user.email,
            user.password
        )
        .fetch_one(&mut *self.pool)
        .await?;

        Ok(result)
    }

    async fn update(&mut self, user: User) -> Result<(), SqlxError> {
        sqlx::query!(
            "UPDATE user SET email = ?, password = ? WHERE id = ?",
            user.email,
            user.password,
            user.id
        )
        .execute(&mut *self.pool)
        .await?;

        Ok(())
    }

    async fn delete(&mut self, user_id: i64) -> Result<(), SqlxError> {
        sqlx::query!("DELETE FROM user WHERE id = ?", user_id)
            .execute(&mut *self.pool)
            .await?;

        Ok(())
    }
}
