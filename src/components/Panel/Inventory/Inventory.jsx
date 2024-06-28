import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./Inventory.css";

const Inventory = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    /*
    const fetchProducts = async () => {
      try {
        const response = await invoke("get_inventory");
        console.log(response);
        setProducts(response);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts();*/
  }, []);

  return (
    <div className="inventory">
      <p className="inventory-title">Existencias</p>
      <div className="table-container">
        <div className="actions">
          <button className="add-button">Agregar</button>
          <button className="edit-button">Editar</button>
          <button className="delete-button">Eliminar</button>
          <button className="report-button">Reporte</button>
        </div>
        <table className="inventory-table">
          <thead>
            <th>Producto</th>
            <th>Stock inicial</th>
            <th>Stock actual</th>
            <th>Precio compra</th>
            <th>Precio venta</th>
            <th>Fecha entrada</th>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.stock_initial}</td>
                <td>{product.stock_current}</td>
                <td>{product.price_purchase}</td>
                <td>{product.price_sell}</td>
                <td>Almacenar fecha de ingreso (pendiente)</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
