import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./Usuarios.css";
import Modal from "../../shared/Modal/Modal";
import UsersTable from "./UsersTable";

const fetchUsers = async () => {
  try {
    const response = await invoke("get_users");
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const createUser = async (formValues) => {
  try {
    const { email, password } = formValues;
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

const assignRoleUser = async (user_id, role_id) => {
  let userId = parseInt(user_id);
  let roleId = parseInt(role_id);
  try {
    const response = await invoke("assign_role_to_user", {
      userId,
      roleId,
    });

    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const updateUser = async (userId, formValues) => {
  try {
    const { email, password } = formValues;
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

const fetchRoles = async () => {
  try {
    const response = await invoke("get_roles");
    return response;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};

const Usuarios = () => {
  const initialUserFormValues = {
    email: "",
    password: "",
    role_id: 0,
  };

  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(initialUserFormValues);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
      const roles = await fetchRoles();
      setRoles(roles);
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
    let userCreated = await createUser(formValues);
    await assignRoleUser(userCreated.id, formValues.role_id);
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
          <div className="form-group">
            <label>Rol:</label>
            <select
              name="role_id"
              onChange={handleInputChange}
              value={formValues.role_id}
              required
            >
              <option value={0}>Seleccione un rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.name}
                </option>
              ))}
            </select>
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
          <div className="form-group">
            <label>Rol:</label>
            <select
              name="role_id"
              onChange={handleInputChange}
              value={formValues.role_id}
              required
            >
              <option value={0}>Seleccione un rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="edit-button">
              Guardar Cambios
            </button>
          </div>
        </form>
      </Modal>
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
