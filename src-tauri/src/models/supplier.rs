use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Supplier {
    pub id: i64,
    pub name: String,
    pub address: String,
    pub phone: String,
    pub email: String,
}
