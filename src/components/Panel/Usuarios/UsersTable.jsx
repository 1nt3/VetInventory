import React, { useState } from "react";

const UsersTable = ({
  users,
  handleAddButtonClick,
  handleEditButtonClick,
  handleDeleteButtonClick,
}) => {
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const togglePasswordVisibility = (index) => {
    setVisiblePasswords((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const getPasswordText = (user, index) => {
    return visiblePasswords[index] ? user.password : "••••••••";
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Usuarios</h2>
      <div className="actions">
        <button className="add-button" onClick={handleAddButtonClick}>
          Agregar
        </button>
      </div>
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Correo</th>
              <th>Contraseña</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.email}</td>
                <td>{getPasswordText(user, index)}</td>
                <td>
                  <button
                    className="toggle-button"
                    onClick={() => togglePasswordVisibility(index)}
                  >
                    {visiblePasswords[index]
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"}
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => handleEditButtonClick(user)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteButtonClick(user)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="actions"></div>
      </div>
    </div>
  );
};

export default UsersTable;
