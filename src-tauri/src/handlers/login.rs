use crate::database::Database;
use sqlx::query;
use tauri::{command, State};

#[command]
pub async fn is_credential_valid(
    state: State<'_, Database>,
    email: &str,
    password: &str,
) -> Result<bool, String> {
    let query = query!(
        r#"
        SELECT EXISTS(SELECT 1 FROM user WHERE email = ? AND password = ?) AS "exists"
        "#,
        email,
        password
    );

    let result = query
        .fetch_one(&state.pool)
        .await
        .map_err(|e| format!("Failed to execute query: {}", e))?;

    let is_valid = result.exists.unwrap_or(0);
    Ok(is_valid != 0)
}

//SELECT EXISTS(SELECT 1 FROM users WHERE email = ? AND password = ?);

// SELECT EXISTS(SELECT 1 FROM users WHERE email = ? AND password = ?);
/*

SELECT COUNT(*)
FROM users
WHERE email = ? AND password = ?;
*/

/*
#[command]
pub async fn create_product(
    state: State<'_, Database>,
    name: &str,
    category: &str,
    supplier: &str,
    description: Option<String>,
) -> Result<Product, String> {
    let new_product = sqlx::query_as!(
        Product,
        r#"
        INSERT INTO product (name, category, supplier, description)
        VALUES (?, ?, ?, ?)
        RETURNING id, name, category, supplier, description
        "#,
        name,
        category,
        supplier,
        description
    )
    .fetch_one(&state.pool)
    .await
    .map_err(|e| format!("Failed to create product: {}", e))?;
    println!("{:?}", new_product);
    Ok(new_product)
}
*/
