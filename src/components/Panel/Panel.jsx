import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Panel.css";
import Usuarios from "./Usuarios/Usuarios";
import ProductManagement from "./ProductManagement/ProductManagement";
import Inventory from "./Inventory/Inventory";

const Panel = ({ setAuthenticated, emailUserCurrent, userRoleCurrent }) => {
  const [currentViewId, setCurrentViewId] = useState("product-management");
  const navigate = useNavigate();

  const renderCurrentView = () => {
    switch (currentViewId) {
      case "product-management":
        return <ProductManagement />;
      case "existencias":
        return <Inventory />;
      case "usuarios":
        return <Usuarios />;
      default:
        return <ProductManagement />;
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    navigate("/logout-loading");
  };

  return (
    <div className="container">
      <div className="admin-panel">
        <aside className="sidebar">
          <div className="user-info">
            <div className="user-avatar"></div>
            <div className="user-details">
              <p>{emailUserCurrent}</p>
              {/*<p>admin</p>*/}
            </div>
          </div>
          <nav className="menu">
            <ul>
              <li>
                <a
                  href="#product-management"
                  className={
                    currentViewId === "product-management" ? "active" : ""
                  }
                  onClick={() => setCurrentViewId("product-management")}
                >
                  Gestión de productos
                </a>
              </li>
              <li>
                <a
                  href="#inventory"
                  className={currentViewId === "existencias" ? "active" : ""}
                  onClick={() => setCurrentViewId("existencias")}
                >
                  Existencias
                </a>
              </li>
              {userRoleCurrent.toUpperCase() === "ADMINISTRADOR" && (
                <li>
                  <a
                    href="#users"
                    className={currentViewId === "usuarios" ? "active" : ""}
                    onClick={() => setCurrentViewId("usuarios")}
                  >
                    Usuarios
                  </a>
                </li>
              )}
            </ul>
          </nav>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </aside>
        <main className="main-content">{renderCurrentView()}</main>
      </div>
    </div>
  );
};

export default Panel;
