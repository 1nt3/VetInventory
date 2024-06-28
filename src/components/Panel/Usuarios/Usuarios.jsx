import React from "react";

const Usuarios = () => (
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
);

export default Usuarios;
