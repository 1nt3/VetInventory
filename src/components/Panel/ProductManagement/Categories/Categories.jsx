import React, { useState, useEffect } from "react";
import useActions from "../../../../hooks/useActions";
import { invoke } from "@tauri-apps/api/tauri";
import "./Categories.css";
import Modal from "../../../shared/Modal/Modal";

const fetchCategories = async () => {
  try {
    const response = await invoke("get_categories");
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const createCategory = async (category) => {
  try {
    const { name, product_count } = category;
    const response = await invoke("create_category", {
      name,
      product_count: parseInt(product_count),
    });
    return response;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

const updateCategory = async (category) => {
  try {
    const response = await invoke("update_category", category);
    return response;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

const deleteCategory = async (categoryId) => {
  try {
    const response = await invoke("delete_category", { id: categoryId });
    return response;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

const Categories = () => {
  const initialFormValues = {
    name: "",
    product_count: 0,
  };

  const {
    items: categories,
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
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    initialFormValues
  );

  return (
    <div className="table-container">
      <h2 className="table-title">Categorías</h2>
      <div className="actions">
        <button className="add-button" onClick={handleAddButtonClick}>
          Agregar
        </button>
      </div>
      <div className="table-wrapper">
        <table className="categories-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad de productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index}>
                <td>{category.name}</td>
                <td>{category.product_count}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEditButtonClick(category)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteButtonClick(category)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar categoría */}
      <Modal
        title="Agregar Categoría"
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleAddSubmit} className="category-form">
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
            <label>Cantidad de productos:</label>
            <input
              type="number"
              name="product_count"
              value={formValues.product_count}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="add-category-button">
              Agregar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para editar categoría */}
      <Modal
        title="Editar Categoría"
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleEditSubmit} className="category-form">
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
            <label>Cantidad de productos:</label>
            <input
              type="number"
              name="product_count"
              value={formValues.product_count}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="edit-category-button">
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
          <p>¿Está seguro de que desea eliminar esta categoría?</p>
          <div className="form-actions">
            <button className="confirm-delete-button" onClick={handleDeleteSubmit}>
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
