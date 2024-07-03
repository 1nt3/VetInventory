use crate::{database::Database, models::role::Role};
use sqlx::prelude::FromRow;
use tauri::State;

#[derive(Debug, serde::Serialize, FromRow)]
pub struct RolUser {
    name: Option<String>,
}

#[tauri::command]
pub async fn is_credential_valid(
    state: State<'_, Database>,
    email: &str,
    password: &str,
) -> Result<bool, String> {
    let mut pool_conn = match state.clone().get_connection().await {
        Ok(conn) => conn,
        Err(e) => return Err(format!("Failed to get database connection: {}", e)),
    };

    let query = sqlx::query!(
        "SELECT email FROM user WHERE email = ? AND password = ?",
        email,
        password
    );

    match query.fetch_one(&mut *pool_conn).await {
        Ok(_result) => Ok(true),
        Err(sqlx::Error::RowNotFound) => Ok(false),
        Err(e) => Err(format!("Failed to execute query: {}", e)),
    }
}

#[tauri::command]
pub async fn get_rol_user(state: State<'_, Database>, email: &str) -> Result<RolUser, String> {
    let mut pool_conn = match state.clone().get_connection().await {
        Ok(conn) => conn,
        Err(e) => return Err(format!("Failed to get database connection: {}", e)),
    };

    let query = sqlx::query_as!(
        RolUser,
        "SELECT r.name
            FROM user u
            JOIN user_role ur ON u.id = ur.user_id
            JOIN role r ON ur.role_id = r.id
            WHERE u.email = ?",
        email,
    );

    match query.fetch_one(&mut *pool_conn).await {
        Ok(result) => Ok(result),
        Err(e) => Err(format!("Failed to execute query: {}", e)),
    }
}

#[tauri::command]
pub async fn get_roles(state: State<'_, Database>) -> Result<Vec<Role>, String> {
    let mut pool_conn = match state.clone().get_connection().await {
        Ok(conn) => conn,
        Err(e) => return Err(format!("Failed to get database connection: {}", e)),
    };

    let query = sqlx::query_as!(Role, "SELECT * FROM role");

    match query.fetch_all(&mut *pool_conn).await {
        Ok(results) => Ok(results),
        Err(e) => Err(format!("Failed to execute query: {}", e)),
    }
}
