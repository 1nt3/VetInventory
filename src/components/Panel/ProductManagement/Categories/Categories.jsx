import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Llamada a la función get_categoryos de Tauri
    /*
    invoke("get_productos")
      .then((response) => {
        setProductos(response);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });*/
  }, []);
  return (
    <div className="table-container">
      <h2 className="table-title">Categorías</h2>
      <div className="actions">
        <button className="add-button">Agregar</button>
        <button className="edit-button">Editar</button>
        <button className="delete-button">Eliminar</button>
      </div>
      <div className="table-wrapper">
        <table className="categories-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad de productos</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index}>
                <td>{category.nombre}</td>
                <td>{category.cantidad_productos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
