use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Role {
    pub id: i64,
    pub name: Option<String>,
    pub description: Option<String>,
}
