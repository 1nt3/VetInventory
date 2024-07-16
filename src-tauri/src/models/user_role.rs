use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct UserRole {
    pub user_id: i64,
    pub role_id: i64,
}
