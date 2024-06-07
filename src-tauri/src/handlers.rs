pub mod login;
pub mod panel;

/*
struct Square {
    side: f32,
}

impl Shape for Square {
    fn area(&self) -> f32 {
        self.side.powi(2)
    }
}

fn main() {
    display_area(&Circle { radius: 1. });
    display_area(&Square { side: 1. });
}

fn display_area(shape: &dyn Shape) {
    println!("area is {}", shape.area())
}
*/
//use tauri::{command, State};

/*
#[command]
pub async fn create_user(
    state: State<'_, Database>,
    username: &str,
    password: &str,
    email: Option<String>,
) -> Result<User, String> {
    let new_user = sqlx::query_as!(
        User,
        r#"
        INSERT INTO user (username, password, email)
        VALUES (?, ?, ?)
        RETURNING id, username, password, email
        "#,
        username,
        password,
        email
    )
    .fetch_one(&state.pool)
    .await
    .map_err(|e| format!("Failed to create user: {}", e))?;

    Ok(new_user)
}

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
