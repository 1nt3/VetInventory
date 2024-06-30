import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./Suppliers.css";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    // Llamada a la función get_productos de Tauri
    /*
    invoke("get_productos")
      .then((response) => {
        setProductos(response);
      })
      .catch((error) => {
        console.error("Error al obtener los supplyos:", error);
      });*/
  }, []);

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <h2 className="table-title">Proveedores</h2>
        <div className="actions">
          <button className="add-button">Agregar</button>
          <button className="edit-button">Editar</button>
          <button className="delete-button">Eliminar</button>
        </div>
        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Correo</th>
              <th>Telefono</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supply, index) => (
              <tr key={index}>
                <td>{supply.correo}</td>
                <td>{supply.telefono}</td>
                <td>{supply.direccion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Suppliers;
