import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const UsersTable = ({
  users,
  handleAddButtonClick,
  handleEditButtonClick,
  handleDeleteButtonClick,
}) => {
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [userRoles, setUserRoles] = useState({});

  const togglePasswordVisibility = (index) => {
    setVisiblePasswords((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const getPasswordText = (user, index) => {
    return visiblePasswords[index] ? user.password : "************";
  };

  const fetchUserRoles = async () => {
    const roles = {};
    for (const user of users) {
      try {
        const role = await invoke("get_rol_user", { email: user.email });
        roles[user.email] = role.name;
      } catch (error) {
        console.error("Error getting user role:", error);
        roles[user.email] = "Error"; // Handle error case
      }
    }
    setUserRoles(roles);
  };

  useEffect(() => {
    fetchUserRoles();
  }, [users]);

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
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(1).map((user, index) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{getPasswordText(user, index)}</td>
                <td>{userRoles[user.email] || "Cargando..."}</td>
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
