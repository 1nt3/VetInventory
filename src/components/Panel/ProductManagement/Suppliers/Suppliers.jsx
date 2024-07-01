import React, { useState, useEffect } from "react";
import useActions from "../../../../hooks/useActions";
import { invoke } from "@tauri-apps/api/tauri";
import "./Suppliers.css";
import Modal from "../../../shared/Modal/Modal";

const fetchSuppliers = async () => {
  try {
    const response = await invoke("get_suppliers");
    return response;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return [];
  }
};

const createSupplier = async (supplier) => {
  try {
    const response = await invoke("create_supplier", {
      ...supplier,
    });
    return response;
  } catch (error) {
    console.error("Error creating supplier:", error);
    throw error;
  }
};

const updateSupplier = async (supplierId, supplier) => {
  try {
    const response = await invoke("update_supplier", {
      supplierId,
      ...supplier,
    });
    return response;
  } catch (error) {
    console.error("Error updating supplier:", error);
    throw error;
  }
};

const deleteSupplier = async (supplierId) => {
  try {
    const response = await invoke("delete_supplier", { supplierId });
    return response;
  } catch (error) {
    console.error("Error deleting supplier:", error);
    throw error;
  }
};

const Suppliers = () => {
  const initialSupplierFormValues = {
    name: "",
    email: "",
    phone: "",
    address: "",
  };

  const {
    items: suppliers,
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    formValues,
    selectedItem,
    handleAddButtonClick,
    handleEditButtonClick,
    handleDeleteButtonClick,
    handleCloseModal,
    handleInputChange,
    handleAddSubmit,
    handleEditSubmit,
    handleDeleteSubmit,
  } = useActions(
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    initialSupplierFormValues
  );

  return (
    <div className="table-container">
      <h2 className="table-title">Proveedores</h2>
      <div className="actions">
        <button className="add-button" onClick={handleAddButtonClick}>
          Agregar
        </button>
      </div>
      <div className="table-wrapper">
        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={index}>
                <td>{supplier.name}</td>
                <td>{supplier.email}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.address}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEditButtonClick(supplier)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteButtonClick(supplier)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title="Agregar Proveedor"
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleAddSubmit} className="supplier-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              required
            />
          </div>
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
            <label>Teléfono:</label>
            <input
              type="text"
              name="phone"
              value={formValues.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Dirección:</label>
            <input
              type="text"
              name="address"
              value={formValues.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="add-supplier-button">
              Agregar
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Editar Proveedor"
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleEditSubmit} className="supplier-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              required
            />
          </div>
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
            <label>Teléfono:</label>
            <input
              type="text"
              name="phone"
              value={formValues.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Dirección:</label>
            <input
              type="text"
              name="address"
              value={formValues.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="add-supplier-button">
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
          <p>¿Está seguro de que desea eliminar este proveedor?</p>
          <div className="form-actions">
            <button
              className="confirm-delete-button"
              onClick={handleDeleteSubmit}
            >
              Confirmar
            </button>
            <button className="cancel-delete-button" onClick={handleCloseModal}>
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Suppliers;
