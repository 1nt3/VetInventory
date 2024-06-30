import React from "react";

const Usuarios = () => (
  <div className="table-container">
    <h2 className="table-title">Usuarios</h2>
    <div className="actions">
      <button className="add-button">Agregar</button>
      <button className="edit-button">Editar</button>
      <button className="delete-button">Eliminar</button>
    </div>
    <table className="users-table">
      <thead>
        <tr>

          <th>Correo</th>
          <th>Contraseña</th>
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
);

export default Usuarios;
