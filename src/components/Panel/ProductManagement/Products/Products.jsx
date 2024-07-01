import React, { useState, useEffect } from "react";
import useProductActions from "../../../../hooks/useProductActions";
import { invoke } from "@tauri-apps/api/tauri";
import "./Products.css";
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

const fetchProducts = async () => {
  try {
    const response = await invoke("get_products");
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const createProduct = async (product) => {
  try {
    const { name, description, category_id, supplier_id } = product;
    const categoryId = parseInt(category_id);
    const supplierId = parseInt(supplier_id);

    console.log(product);

    const response = await invoke("create_product", {
      name,
      description,
      categoryId,
      supplierId,
    });
    return response;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

const updateProduct = async (product) => {
  try {
    const response = await invoke("update_product", product);
    return response;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

const deleteProduct = async (productId) => {
  try {
    const response = await invoke("delete_product", { id: productId });
    return response;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

const fetchCategories = async () => {
  try {
    const response = await invoke("get_categories");
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const Products = () => {
  const {
    items: products,
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
  } = useProductActions(
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  );

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setCategories(await fetchCategories());
      setSuppliers(await fetchSuppliers());
    };
    loadData();
  }, []);

  const getCategoryName = (id) => {
    const category = categories.find((category) => category.id === id);
    return category ? category.name : "";
  };

  const getSupplierName = (id) => {
    const supplier = suppliers.find((supplier) => supplier.id === id);
    return supplier ? supplier.name : "";
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Productos</h2>
      <div className="actions">
        <button className="add-button" onClick={handleAddButtonClick}>
          Agregar
        </button>
      </div>
      <div className="table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{getCategoryName(product.category_id)}</td>
                <td>{getSupplierName(product.supplier_id)}</td>
                <td>{product.description}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEditButtonClick(product)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteButtonClick(product)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal para agregar producto */}
      <Modal
        title="Agregar Producto"
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleAddSubmit} className="product-form">
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
            <label>Categoría:</label>
            <select
              name="category_id"
              value={formValues.category_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Proveedor:</label>
            <select
              name="supplier_id"
              value={formValues.supplier_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione un proveedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="add-product-button">
              Agregar
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        title="Editar Producto"
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleEditSubmit} className="product-form">
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
            <label>Categoría:</label>
            <select
              name="category_id"
              value={formValues.category_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Proveedor:</label>
            <select
              name="supplier_id"
              value={formValues.supplier_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione un proveedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="add-product-button">
              Guardar Cambios
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
