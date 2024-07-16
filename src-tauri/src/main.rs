// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod handlers;
mod models;
mod repository;

use database::Database;
use handlers::login::{
    assign_role_to_user, create_user, delete_user, get_rol_user, get_roles, get_users,
    is_credential_valid, update_user,
};
use handlers::product_manager::{
    add_stock, create_category, create_product, create_supplier, delete_category, delete_product,
    delete_supplier, get_amount_products_by_category, get_categories, get_products, get_suppliers,
    update_category, update_inventory, update_product, update_supplier, update_utility_product,
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
            update_user,
            add_stock,
            update_utility_product,
            get_rol_user,
            get_roles,
            assign_role_to_user
        ])
        .run(tauri::generate_context!())
        .expect("Failed to run Tauri application");
}
