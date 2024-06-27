use crate::{
    database::Database,
    repository::{product_repository::ProductRepository, Repository},
};
use tauri::State;

use crate::models::product::Product;

#[tauri::command]
pub async fn create_product(
    state: State<'_, Database>,
    name: &str,
    description: Option<String>,
    category_id: i64,
    supplier_id: i64,
) -> Result<(), String> {
    println!("name: {}", name);
    println!("description: {:?}", description);
    println!("category_id: {}", category_id);
    println!("supplier_id: {}", supplier_id);

    let pool_conn = match state.clone().get_connection().await {
        Ok(conn) => conn,
        Err(e) => return Err(format!("Failed to get database connection: {}", e)),
    };

    let new_product = Product {
        id: 0,
        name: name.to_string(),
        description,
        category_id,
        supplier_id,
        price_purchase: 0.0,
        price_sell: 0.0,
        stock_initial: 0,
        stock_current: 0,
    };

    let mut product_rep = ProductRepository::new(pool_conn);
    match product_rep.create(new_product).await {
        Ok(_) => {
            println!("Producto creado exitosamente.");
            Ok(())
        }
        Err(e) => Err(format!("Error al crear producto: {}", e)),
    }
}
