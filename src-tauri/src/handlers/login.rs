use crate::database::Database;
use tauri::State;

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
        "SELECT email FROM user WHERE email = ? AND password = ?;",
        email,
        password
    );

    match query.fetch_one(&mut *pool_conn).await {
        Ok(result) => {
            println!("{:?}", result);
            Ok(true)
        }
        Err(sqlx::Error::RowNotFound) => Ok(false),
        Err(e) => Err(format!("Failed to execute query: {}", e)),
    }
}
