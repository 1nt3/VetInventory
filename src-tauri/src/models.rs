// models.rs

/*#[derive(Insertable)]
#[table_name = "users"]
pub struct NewUser<'a> {
    pub username: &'a str,
    pub password: &'a str,
}*/
pub mod category;
pub mod product;
pub mod role;
pub mod supplier;
pub mod user;
pub mod user_role;
