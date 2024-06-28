import React, { useState } from "react";
import Products from "./Products/Products";
import Categories from "./Categories/Categories";
import Suppliers from "./Suppliers/Suppliers";
import "./ProductManagement.css";

const ProductManagement = () => {
  const [activeSubSection, setActiveSubSection] = useState(null);

  const renderSubContent = () => {
    switch (activeSubSection) {
      case "Productos":
        return <Products />;
      case "Categorías":
        return <Categories />;
      case "Proveedores":
        return <Suppliers />;
      default:
        return null;
    }
  };

  return (
    <div className="product-management">
      <p className="management-title">Gestión de productos</p>
      {activeSubSection ? (
        <div className="sub-content">
          <button
            className="back-button"
            onClick={() => setActiveSubSection(null)}
          >
            Regresar
          </button>
          {renderSubContent()}
        </div>
      ) : (
        <div className="sub-menu">
          <button onClick={() => setActiveSubSection("Productos")}>
            Productos
          </button>
          <button onClick={() => setActiveSubSection("Categorías")}>
            Categorías
          </button>
          <button onClick={() => setActiveSubSection("Proveedores")}>
            Proveedores
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
