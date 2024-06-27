import React, { useState } from "react";
import "./Panel.css";

// Componentes para las diferentes vistas
const Productos = React.memo(() => (
  <div className="productos">
    <h2>Gestión de Productos</h2>
    <button className="add-button">Agregar</button>
    <button className="edit-button">Editar</button>
    <button className="delete-button">Eliminar</button>
    <table className="productos-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Proveedor</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
));

const Categorias = React.memo(() => (
  <div className="categorias">
    <h2>Gestión de Categorías</h2>
    <button className="add-button">Agregar</button>
    <button className="edit-button">Editar</button>
    <button className="delete-button">Eliminar</button>
    <table className="categorias-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Cantidad</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
));

const Proveedores = React.memo(() => (
  <div className="proveedores">
    <h2>Gestión de Proveedores</h2>
    <button className="add-button">Agregar</button>
    <button className="edit-button">Editar</button>
    <button className="delete-button">Eliminar</button>
    <table className="proveedores-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Telefono</th>
          <th>Dirección</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
));

const Existencias = React.memo(() => (
  <div className="existencias">
    <h2>Existencias</h2>
    <div className="header">
      <button className="add-button">Agregar</button>
      <button className="edit-button">Editar</button>
      <button className="delete-button">Eliminar</button>
      <button className="report-button">Reporte</button>
    </div>
    <table className="existencias-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Categoría</th>
          <th>Proveedor</th>
          <th>Stock inicial</th>
          <th>Stock actual</th>
          <th>Precio compra</th>
          <th>Precio venta</th>
          <th>Entrada por</th>
          <th>Fecha entrada</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
));

const Usuarios = React.memo(() => (
  <div className="usuarios">
    <h2>Usuarios</h2>
    <div className="header">
      <button className="add-button">Agregar</button>
      <button className="edit-button">Editar</button>
      <button className="delete-button">Eliminar</button>
    </div>
    <table className="usuarios-table">
      <thead>
        <tr>
          <th>Nombre completo</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Contraseña</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
));

const Panel = () => {
  const [currentViewId, setCurrentViewId] = useState("productos");

  const renderCurrentView = () => {
    switch (currentViewId) {
      case "productos":
        return <Productos />;
      case "categorias":
        return <Categorias />;
      case "proveedores":
        return <Proveedores />;
      case "existencias":
        return <Existencias />;
      case "usuarios":
        return <Usuarios />;
      default:
        return <Productos />;
    }
  };



  const getCurrentViewTitle = () => {
    switch (currentViewId) {
      case "productos":
        return "Gestión de Productos";
      case "categorias":
        return "Gestión de Categorías";
      case "proveedores":
        return "Gestión de Proveedores";
      case "existencias":
        return "Existencias";
      case "usuarios":
        return "Gestión de Usuarios";
      default:
        return "Gestión de Productos";
    }
  };

  return (
    <div className="container">
      <div className="admin-panel">
        <aside className="sidebar">
          <div className="user-info">
            <div className="user-avatar"></div>
            <div className="user-details">
              <p>example@gmail.com</p>
              <p>admin</p>
            </div>
          </div>
          <nav className="menu">
            <ul>
              <li>
                <a href="#product-management" onClick={() => setCurrentViewId("productos")}>
                  Gestión de productos
                </a>
              </li>
              <li>
                <a href="#inventory" onClick={() => setCurrentViewId("existencias")}>
                  Existencias
                </a>
              </li>
              <li>
                <a href="#users" onClick={() => setCurrentViewId("usuarios")}>
                  Usuarios
                </a>
              </li>
            </ul>
          </nav>
          <button className="logout-button">Cerrar sesión</button>
        </aside>
        <main className="main-content">
          <h1>{getCurrentViewTitle()}</h1>
          {currentViewId !== "existencias" && currentViewId !== "usuarios" && (
            <div className="product-management">
              <button
                className="product-button"
                onClick={() => setCurrentViewId("productos")}
              >
                Productos
              </button>
              <button
                className="category-button"
                onClick={() => setCurrentViewId("categorias")}
              >
                Categorías
              </button>
              <button
                className="supplier-button"
                onClick={() => setCurrentViewId("proveedores")}
              >
                Proveedores
              </button>
            </div>
          )}
          <div className="view-content">{renderCurrentView()}</div>
        </main>
      </div>
    </div>
  );
};

export default Panel;
