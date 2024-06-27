-- Add migration script here
INSERT INTO user (email, password) VALUES ('drcostadelrio@gmail.com', 'admin123');

-- Insertar roles
INSERT INTO role (name, description) VALUES ('Admin', 'Administrator role');
INSERT INTO role (name, description) VALUES ('User', 'Regular user role');

-- Insertar permisos
INSERT INTO permission (name) VALUES ('Create');
INSERT INTO permission (name) VALUES ('Read');
INSERT INTO permission (name) VALUES ('Update');
INSERT INTO permission (name) VALUES ('Delete');

-- Insertar categorías
INSERT INTO category (name) VALUES ('Medicamentos');
INSERT INTO category (name) VALUES ('Accesorios');
INSERT INTO category (name) VALUES ('Alimentos');

-- Insertar proveedores
INSERT INTO provider (name, address, phone, email) VALUES ('Provider A', '123 Main St', '555-1234', 'providerA@example.com');
INSERT INTO provider (name, address, phone, email) VALUES ('Provider B', '456 Elm St', '555-5678', 'providerB@example.com');

-- Insertar medicamentos
INSERT INTO product (name, description, category_id, provider_id, price_purchase, price_sell, stock_initial, stock_current) VALUES ('Product 1', 'Product 1 description', 1, 1, 10.0, 15.0, 100, 100);
INSERT INTO product (name, description, category_id, provider_id, price_purchase, price_sell, stock_initial, stock_current) VALUES ('Product 2', 'Product 2 description', 2, 2, 20.0, 25.0, 150, 150);

-- Insertar relaciones de roles y permisos (ejemplo: asignar todos los permisos al rol de administrador)
INSERT INTO role_permission (role_id, permission_id) VALUES (1, 1);
INSERT INTO role_permission (role_id, permission_id) VALUES (1, 2);
INSERT INTO role_permission (role_id, permission_id) VALUES (1, 3);
INSERT INTO role_permission (role_id, permission_id) VALUES (1, 4);

-- Insertar usuario con rol de administrador
INSERT INTO user (email, password) VALUES ('admin@example.com', 'admin123');
INSERT INTO user_role (user_id, role_id) VALUES (1, 1);