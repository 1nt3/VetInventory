// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod handlers;
mod models;
mod repository;

use database::Database;
use handlers::login::is_credential_valid;
use handlers::product_manager::{
    create_category, create_product, create_supplier, create_user, delete_category, delete_product,
    delete_supplier, delete_user, get_amount_products_by_category, get_categories, get_products,
    get_suppliers, get_users, update_category, update_inventory, update_product, update_supplier,
    update_user,
};

use tauri::async_runtime::block_on;

fn main() {
    let database = block_on(Database::connect()).expect("Error connecting database.");
    tauri::Builder::default()
        .manage(database)
        .invoke_handler(tauri::generate_handler![
            is_credential_valid,
            create_product,
            get_products,
            get_categories,
            get_suppliers,
            update_product,
            delete_product,
            create_category,
            create_supplier,
            delete_category,
            update_category,
            update_supplier,
            update_inventory,
            get_amount_products_by_category,
            delete_supplier,
            create_user,
            get_users,
            delete_user,
            update_user
        ])
        .run(tauri::generate_context!())
        .expect("Failed to run Tauri application");
}
