use crate::{
    database::Database,
    models::{role::Role, user::User, user_role::UserRole},
    repository::{user_repository::UserRepository, Repository},
};
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
pub async fn create_user(
    state: State<'_, Database>,
    email: &str,
    password: &str,
) -> Result<User, String> {
    let pool_conn = state
        .clone()
        .get_connection()
        .await
        .map_err(|_| "Failed to get database connection".to_string())?;

    let new_user = User {
        id: 0,
        email: email.to_string(),
        password: password.to_string(),
    };

    let mut user_rep = UserRepository::new(pool_conn);

    match user_rep.create(new_user).await {
        Ok(user) => Ok(user),
        Err(e) => Err(format!("Error al crear usuario: {}", e)),
    }
}

#[tauri::command]
pub async fn get_users(state: State<'_, Database>) -> Result<Vec<User>, String> {
    let pool_conn = state
        .clone()
        .get_connection()
        .await
        .map_err(|_| "Failed to get database connection".to_string())?;

    let mut user_rep = UserRepository::new(pool_conn);
    let users = user_rep
        .find_all()
        .await
        .map_err(|e| format!("Error en la obtención de usuarios: {}", e))?;

    Ok(users)
}

#[tauri::command]
pub async fn delete_user(state: State<'_, Database>, user_id: i64) -> Result<(), String> {
    let mut pool_conn = state
        .clone()
        .get_connection()
        .await
        .map_err(|_| "Failed to get database connection".to_string())?;

    let query = sqlx::query!("DELETE FROM user_role WHERE user_id = ?", user_id);

    query
        .execute(&mut *pool_conn)
        .await
        .map_err(|e| format!("Error al eliminar el role asociado al user: {}", e))?;

    let mut user_rep = UserRepository::new(pool_conn);
    user_rep
        .delete(user_id)
        .await
        .map_err(|e| format!("Error en la eliminación del usuario: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn update_user(
    state: State<'_, Database>,
    user_id: i64,
    email: &str,
    password: &str,
) -> Result<(), String> {
    let pool_conn = state
        .clone()
        .get_connection()
        .await
        .map_err(|_| "Failed to get database connection".to_string())?;

    let mut user_rep = UserRepository::new(pool_conn);
    let user_update = User {
        id: user_id,
        email: email.to_string(),
        password: password.to_string(),
    };

    user_rep
        .update(user_update)
        .await
        .map_err(|e| format!("Error en la actualización del usuario: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn assign_role_to_user(
    state: State<'_, Database>,
    user_id: i64,
    role_id: i64,
) -> Result<(), String> {
    let mut pool_conn = match state.clone().get_connection().await {
        Ok(conn) => conn,
        Err(e) => return Err(format!("Failed to get database connection: {}", e)),
    };

    let new_user_rol = UserRole { user_id, role_id };

    let query = sqlx::query_as!(
        UserRole,
        "INSERT INTO user_role (user_id, role_id) VALUES (?, ?);",
        new_user_rol.user_id,
        new_user_rol.role_id
    );

    match query.execute(&mut *pool_conn).await {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to assign role to user: {}", e)),
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
