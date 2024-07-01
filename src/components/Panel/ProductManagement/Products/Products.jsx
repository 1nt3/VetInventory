import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Modal from "../Modal";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    category_id: 0,
    supplier_id: 0,
  });
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await invoke("get_products");
      setProducts(response);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await invoke("get_categories");
      setCategories(response);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await invoke("get_suppliers");
      setSuppliers(response);
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
    }
  };

  const handleAddButtonClick = () => {
    setFormValues({
      name: '',
      description: '',
      category_id: 0,
      supplier_id: 0,
    });
    setIsModalOpen(true);
  };

  const handleEditButtonClick = () => {
    setIsEditMode(!isEditMode);
    setSelectedProducts([]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedProducts([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, category_id, supplier_id } = formValues;
    const categoryId = parseInt(category_id);
    const supplierId = parseInt(supplier_id);

    try {
      if (isEditMode) {
        await invoke("update_product", {
          name,
          id: selectedProducts[0],
          description,
          categoryId,
          supplierId,
        });
      } else {
        await invoke("create_product", {
          name,
          description,
          categoryId,
          supplierId,
        });
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error(`Error al ${isEditMode ? "editar" : "agregar"} el producto:`, error);
    }
  };

  const getCategoryName = (id) => {
    const category = categories.find((category) => category.id === id);
    return category ? category.name : "";
  };

  const getSupplierName = (id) => {
    const supplier = suppliers.find((supplier) => supplier.id === id);
    return supplier ? supplier.name : "";

  };
  const handleDeleteButtonClick = () => {
    setSelectedProducts([]);
    setIsDeleteMode(!isDeleteMode);

  };
  const handleProductSelect = (productId) => {
      setSelectedProducts([productId]);
    if (isEditMode) {
        setFormValues({
          name: selectedProduct.name,
          category_id: selectedProduct.category_id,
          supplier_id: selectedProduct.supplier_id,
          description: selectedProduct.description,
      if (selectedProduct) {
      const selectedProduct = products.find(p => p.id === productId);
        });
        setIsModalOpen(true);
      }
    } else {
      setSelectedProducts(prevSelected =>
        prevSelected.includes(productId)
          ? prevSelected.filter(id => id !== productId)
          : [...prevSelected, productId]
      );
    }
  };

  const handleConfirmDeleteClick = () => {
  };
      setIsDeleteModalOpen(true);
    }
    if (selectedProducts.length > 0) {

    try {
  const handleConfirmDelete = async () => {
      setSelectedProducts([]);
      await invoke("delete_products", { productIds: selectedProducts });
      fetchProducts();
      setIsDeleteModalOpen(false);
      setIsDeleteMode(false);
    } catch (error) {
      console.error("Error al eliminar los productos:", error);
    }

  };
  return (
    <div className="products-container">
      <h2 className="table-title">Productos</h2>
      <div className="actions">
        {!isDeleteMode && !isEditMode && (
          <button className="add-button" onClick={handleAddButtonClick}>
            Agregar
          </button>
        )}
        <button
          className={isEditMode ? "cancel-edit-button" : "edit-button"}
          onClick={handleEditButtonClick}
        >
          {isEditMode ? "Cancelar Edición" : "Editar"}
        </button>
        <button
          className={isDeleteMode ? "cancel-delete-button" : "delete-button"}
          onClick={handleDeleteButtonClick}
        >
          {isDeleteMode ? "Cancelar Eliminación" : "Eliminar"}
        </button>
        {isDeleteMode && (
          <button
            className="confirm-delete-button"
            onClick={handleConfirmDeleteClick}
            disabled={selectedProducts.length === 0}
          >
            Confirmar Eliminación
          </button>
        )}
      </div>
      <div className="table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              {(isDeleteMode || isEditMode) && <th>Seleccionar</th>}
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                {(isDeleteMode || isEditMode) && (
                  <td>
                      type="checkbox"
                    <input
                )}
                  </td>
                      disabled={isEditMode && selectedProducts.length === 1 && !selectedProducts.includes(product.id)}
                      onChange={() => handleProductSelect(product.id)}
                      checked={selectedProducts.includes(product.id)}
                    />
                <td>{product.name}</td>
                <td>{getCategoryName(product.category_id)}</td>
                <td>{getSupplierName(product.supplier_id)}</td>
                <td>{product.description}</td>
              </tr>
            ))}
        </table>
          </tbody>
      </div>
      <Modal title={isEditMode ? "Editar Producto" : "Agregar Producto"} isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit} className="product-form">
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
              {isEditMode ? "Guardar Cambios" : "Agregar"}
            </button>
          </div>
        </form>
      </Modal>
      <Modal title="Confirmar Eliminación" isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <p>¿Está seguro de que desea eliminar los productos seleccionados?</p>
        <div className="form-actions">
          <button onClick={() => setIsDeleteModalOpen(false)} className="cancel-button">Cancelar</button>
          <button onClick={handleConfirmDelete} className="confirm-delete-button">Confirmar</button>
        </div>
      </Modal>
    </div>
  );
};

export default Products;