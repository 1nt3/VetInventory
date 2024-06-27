-- Add migration script here
-- Crear tabla user
CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT,
  password TEXT
);

-- Crear tabla role
CREATE TABLE role (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT
);

-- Crear tabla permission
CREATE TABLE permission (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT
);

-- Crear tabla user_role
CREATE TABLE user_role (
  user_id INTEGER,
  role_id INTEGER,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (role_id) REFERENCES role(id)
);

-- Crear tabla role_permission
CREATE TABLE role_permission (
  role_id INTEGER,
  permission_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (permission_id) REFERENCES permission(id)
);

-- Crear tabla product
CREATE TABLE product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category_id INTEGER NOT NULL,
  supplier_id INTEGER NOT NULL,
  price_purchase DECIMAL NOT NULL,
  price_sell DECIMAL NOT NULL,
  stock_initial INTEGER NOT NULL,
  stock_current INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES category(id),
  FOREIGN KEY (supplier_id) REFERENCES supplier(id)
);

-- Crear tabla category
CREATE TABLE category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Crear tabla supplier
CREATE TABLE supplier (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL
);

-- Crear tabla medication
CREATE TABLE medication (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  prescription_required BOOLEAN NOT NULL,
  FOREIGN KEY (product_id) REFERENCES product(id)
);