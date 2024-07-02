import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./Usuarios.css";
import Modal from "../../shared/Modal/Modal";
import UsersTable from "./UsersTable";

// Funciones para obtener y manejar usuarios
const fetchUsers = async () => {
  try {
    const response = await invoke("get_users");
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const createUser = async (user) => {
  try {
    const { email, password } = user;
    const response = await invoke("create_user", {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const updateUser = async (userId, user) => {
  try {
    const { email, password } = user;
    const response = await invoke("update_user", {
      userId,
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await invoke("delete_user", { userId });
    return response;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

const Usuarios = () => {
  const initialUserFormValues = {
    email: "",
    password: "",
  };

  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(initialUserFormValues);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    loadUsers();
  }, []);

  const handleAddButtonClick = () => {
    setFormValues(initialUserFormValues);
    setIsAddModalOpen(true);
  };

  const handleEditButtonClick = (user) => {
    setFormValues(user);
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteButtonClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    await createUser(formValues);
    setIsAddModalOpen(false);
    setUsers(await fetchUsers());
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    await updateUser(selectedUser.id, formValues);
    setIsEditModalOpen(false);
    setUsers(await fetchUsers());
  };

  const handleDeleteSubmit = async () => {
    await deleteUser(selectedUser.id);
    setIsDeleteModalOpen(false);
    setUsers(await fetchUsers());
  };

  return (
    <div className="table-container">
      <UsersTable
        users={users}
        handleAddButtonClick={handleAddButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        handleDeleteButtonClick={handleDeleteButtonClick}
      />

      {/* Modal para agregar usuario */}
      <Modal
        title="Agregar Usuario"
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleAddSubmit} className="form">
          <div className="form-group">
            <label>Correo:</label>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="add-button">
              Agregar
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        title="Editar Usuario"
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleEditSubmit} className="form">
          <div className="form-group">
            <label>Correo:</label>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="edit-button">
              Guardar Cambios
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal
        title="Confirmar Eliminación"
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
      >
        <div className="confirmation-message">
          <p>¿Está seguro de que desea eliminar este usuario?</p>
          <div className="form-actions">
            <button
              className="confirm-delete-button"
              onClick={handleDeleteSubmit}
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Usuarios;
