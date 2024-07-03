use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Product {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub category_id: i64,
    pub supplier_id: i64,
    pub price_purchase: f64,
    pub price_sell: f64,
    pub stock_initial: i64,
    pub stock_current: i64,
    pub utility: f64,
}
