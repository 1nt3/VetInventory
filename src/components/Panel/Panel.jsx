import React, { useState } from "react";
import "./Panel.css";

// Componentes para las diferentes vistas
const Productos = () => <div>Vista de Productos</div>;
const Categorias = () => <div>Vista de Categorías</div>;
const Proveedores = () => <div>Vista de Proveedores</div>;

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
