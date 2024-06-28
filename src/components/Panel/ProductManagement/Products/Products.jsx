import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await invoke("get_products");
        console.log(response);
        setProducts(response);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="table-container">
      <h2 className="table-title">Productos</h2>
      <div className="actions">
        <button className="add-button">Agregar</button>
        <button className="edit-button">Editar</button>
        <button className="delete-button">Eliminar</button>
      </div>
      <table className="products-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.category_id}</td>
              <td>{product.supplier_id}</td>
              <td>{product.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
