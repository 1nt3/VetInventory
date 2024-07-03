import React, { useState, useEffect } from "react";
import useActions from "../../../../hooks/useActions";
import { invoke } from "@tauri-apps/api/tauri";
import "./Products.css";
import Modal from "../../../shared/Modal/Modal";

const Products = () => {
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

  const updateProduct = async (productId, product) => {
    try {
      const { name, description, category_id, supplier_id } = product;
      const categoryId = parseInt(category_id);
      const supplierId = parseInt(supplier_id);

      const response = await invoke("update_product", {
        productId,
        name,
        description,
        categoryId,
        supplierId,
      });
      return response;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await invoke("delete_product", { productId });
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

  const addStock = async (oldProduct, newProduct) => {
    try {
      const STOCK_INITIAL = 0;
      let stock_current_new = parseInt(newProduct.stock_current);

      if (oldProduct.stock_initial === STOCK_INITIAL) {
        oldProduct.stock_initial = stock_current_new;
      }

      oldProduct.stock_current += stock_current_new;

      const productId = oldProduct.id;
      const stockInitial = oldProduct.stock_initial;
      const stockCurrent = oldProduct.stock_current;
      //console.log(stockInitial);
      //console.log(stockCurrent);
      const response = await await invoke("add_stock", {
        productId,
        stockInitial,
        stockCurrent,
      });
      return response;
    } catch (error) {
      console.error("Error add stock:", error);
      return [];
    }
  };

  const initialProductFormValues = {
    name: "",
    description: "",
    category_id: 0,
    supplier_id: 0,
    stock_initial: 0,
    stock_current: 0,
  };

  const {
    items: products,
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    formValues,
    selectedProduct,
    handleAddButtonClick,
    handleEditButtonClick,
    handleDeleteButtonClick,
    handleCloseModal,
    handleInputChange,
    handleAddSubmit,
    handleEditSubmit,
    handleDeleteSubmit,
    setItems: setProducts,
  } = useActions(
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    initialProductFormValues
  );

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const [formProductStockValues, setFormProductStockValues] = useState(
    initialProductFormValues
  );
  const [selectedProductStock, setSelectedProductStock] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setCategories(await fetchCategories());
      setSuppliers(await fetchSuppliers());
    };
    loadData();
  }, []);

  const handleCloseStockModal = () => {
    setIsStockModalOpen(false);
  };

  const handleStockButtonClick = (item) => {
    setFormProductStockValues(item);
    setSelectedProductStock(item);
    setIsStockModalOpen(true);
  };

  const handleStockSubmit = async (event) => {
    event.preventDefault();
    await addStock(selectedProductStock, formProductStockValues);
    setIsStockModalOpen(false);
    setProducts(await fetchProducts());
  };

  const handleInputChangeStock = (event) => {
    const { name, value } = event.target;
    setFormProductStockValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

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
          Crear
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
              <th>Stock</th>
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
                <td>{product.stock_current}</td>
                <td>
                  <button
                    className="stock-button"
                    onClick={() => handleStockButtonClick(product)}
                  >
                    Añadir Stock
                  </button>
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
        title="Crear Producto"
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleAddSubmit} className="form">
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
            <button type="submit" className="add-button">
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
        <form onSubmit={handleEditSubmit} className="form">
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
            <button type="submit" className="add-button">
              Guardar Cambios
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Agregar Stock"
        isOpen={isStockModalOpen}
        onClose={handleCloseStockModal}
      >
        <form onSubmit={handleStockSubmit} className="form">
          <div className="form-group">
            <label>Cantidad:</label>
            <input
              type="number"
              name="stock_current"
              onChange={handleInputChangeStock}
              min="0"
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

      {/* Modal para confirmar eliminación */}
      <Modal
        title="Confirmar Eliminación"
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
      >
        <div className="confirmation-message">
          <p>¿Está seguro de que desea eliminar este producto?</p>
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

export default Products;
