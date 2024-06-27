// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod handlers;
mod models;
mod repository;

use database::Database;
use handlers::product_manager::create_product;
use handlers::login::is_credential_valid;

use tauri::async_runtime::block_on;

fn main() {
    let database = block_on(Database::connect()).expect("Error connecting database.");
    tauri::Builder::default()
        .manage(database)
        .invoke_handler(tauri::generate_handler![
            is_credential_valid,
            create_product
        ])
        .run(tauri::generate_context!())
        .expect("Failed to run Tauri application");
}
