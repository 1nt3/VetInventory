// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod handlers;
mod models;

use database::Database;
use handlers::login::is_credential_valid;
//use handlers::panel::

use tauri::async_runtime::block_on;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let database: Database = block_on(Database::connect()).expect("Failed connection.");
    block_on(database.migrate()).expect("Failed migration.");
    tauri::Builder::default()
        .manage(database) // Add Arc<Mutex<Database>> State.
        .invoke_handler(tauri::generate_handler![greet, is_credential_valid]) //, create_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
