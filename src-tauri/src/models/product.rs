use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Product {
    pub id: i64,
    pub name: String,
    pub category: String,
    pub supplier: String,
    pub description: Option<String>,
}
