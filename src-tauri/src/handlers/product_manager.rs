use crate::{
    database::Database,
    repository::{
        category_repository::CategoryRepository, product_repository::ProductRepository,
        supplier_repository::SupplierRepository, Repository,
    },
};
use tauri::State;

use crate::models::category::Category;
use crate::models::product::Product;
use crate::models::supplier::Supplier;

#[tauri::command]
pub async fn create_product(
    state: State<'_, Database>,
    name: &str,
    description: Option<String>,
    category_id: i64,
    supplier_id: i64,
) -> Result<(), String> {
    let pool_conn = state
        .clone()
        .get_connection()
        .await
        .map_err(|_| "Failed to get database connection".to_string())?;

    let new_product = Product {
        id: 0,
        name: name.to_string(),
        description,
        category_id,
        supplier_id,
        price_purchase: 1.0,
        price_sell: 1.0,
        stock_initial: 0,
        stock_current: 0,
    };

    let mut product_rep = ProductRepository::new(pool_conn);

    if let Err(e) = product_rep.create(new_product).await {
        return Err(format!("Error al crear producto: {}", e,));
    }

    println!("Producto creado exitosamente.");
    Ok(())
}

#[tauri::command]
pub async fn get_products(state: State<'_, Database>) -> Result<Vec<Product>, String> {
    let pool_conn = state
        .clone()
        .get_connection()
        .await
        .map_err(|_| "Failed to get database connection".to_string())?;

    let mut product_rep = ProductRepository::new(pool_conn);
    let products = product_rep
        .find_all()
        .await
        .map_err(|e| format!("Error en la obtención de productos: {}", e))?;

    //println!("Productos {:?}", products);
    Ok(products)
}

#[tauri::command]
pub async fn get_categories(state: State<'_, Database>) -> Result<Vec<Category>, String> {
    let pool_conn = state
        .clone()
        .get_connection()
        .await
        .map_err(|_| "Failed to get database connection".to_string())?;

    let mut category_rep = CategoryRepository::new(pool_conn);
    let categories = category_rep
        .find_all()
        .await
        .map_err(|e| format!("Error en la obtención de productos: {}", e))?;

    //println!("Productos {:?}", products);
    Ok(categories)
}

#[tauri::command]
pub async fn get_suppliers(state: State<'_, Database>) -> Result<Vec<Supplier>, String> {
    let pool_conn = state
        .clone()
        .get_connection()
        .await
        .map_err(|_| "Failed to get database connection".to_string())?;

    let mut supplier_rep = SupplierRepository::new(pool_conn);
    let suppliers = supplier_rep
        .find_all()
        .await
        .map_err(|e| format!("Error en la obtención de productos: {}", e))?;

    //println!("Productos {:?}", products);
    Ok(suppliers)
}
