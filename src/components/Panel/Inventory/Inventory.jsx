import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./Inventory.css";
import Modal from "../../shared/Modal/Modal";

const fetchProducts = async () => {
  try {
    const response = await invoke("get_products");
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const Inventory = () => {
  const initialProductFormValues = {
    name: "",
    description: "",
    category_id: 0,
    supplier_id: 0,
    stock_initial: 0,
    stock_current: 0,
    price_purchase: 0,
    price_sell: 0,
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(initialProductFormValues);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setProducts(await fetchProducts());
      setCategories(await fetchCategories());
      setSuppliers(await fetchSuppliers());
    };
    loadData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await invoke("get_categories");
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await invoke("get_suppliers");
      return response;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      return [];
    }
  };

  const handleAddButtonClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditButtonClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
    setFormValues({
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      supplier_id: product.supplier_id,
      stock_initial: product.stock_initial,
      stock_current: product.stock_current,
      price_purchase: product.price_purchase,
      price_sell: product.price_sell,
    });
  };

  const handleDeleteButtonClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setFormValues(initialProductFormValues);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(formValues);
      setProducts(await fetchProducts());
      handleCloseModal();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(selectedProduct.id, formValues);
      setProducts(await fetchProducts());
      handleCloseModal();
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await deleteProduct(selectedProduct.id);
      setProducts(await fetchProducts());
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const createProduct = async (product) => {
    try {
      const { name, description, category_id, supplier_id, stock_initial, stock_current, price_purchase, price_sell } = product;
      const categoryId = parseInt(category_id);
      const supplierId = parseInt(supplier_id);
      const initialStock = parseInt(stock_initial);
      const currentStock = parseInt(stock_current);
      const purchasePrice = parseFloat(price_purchase);
      const sellPrice = parseFloat(price_sell);

      const response = await invoke("create_product", {
        name,
        description,
        categoryId,
        supplierId,
        stock_initial: initialStock,
        stock_current: currentStock,
        price_purchase: purchasePrice,
        price_sell: sellPrice,
      });
      return response;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  const updateProduct = async (productId, product) => {
    try {
      const { name, description, category_id, supplier_id, stock_initial, stock_current, price_purchase, price_sell } = product;
      const categoryId = parseInt(category_id);
      const supplierId = parseInt(supplier_id);
      const initialStock = parseInt(stock_initial);
      const currentStock = parseInt(stock_current);
      const purchasePrice = parseFloat(price_purchase);
      const sellPrice = parseFloat(price_sell);

      const response = await invoke("update_product", {
        productId,
        name,
        description,
        categoryId,
        supplierId,
        stock_initial: initialStock,
        stock_current: currentStock,
        price_purchase: purchasePrice,
        price_sell: sellPrice,
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

  const getCategoryName = (id) => {
    const category = categories.find((category) => category.id === id);
    return category ? category.name : "";
  };

  const getSupplierName = (id) => {
    const supplier = suppliers.find((supplier) => supplier.id === id);
    return supplier ? supplier.name : "";
  };

  return (
    <div className="inventory">
      <p className="inventory-title">Existencias</p>
      <div className="table-container">
        <div className="actions">

        </div>
        <div className="table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Stock inicial</th>
                <th>Stock actual</th>
                <th>Precio compra</th>
                <th>Precio venta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.stock_initial}</td>
                  <td>{product.stock_current}</td>
                  <td>{product.price_purchase}</td>
                  <td>{product.price_sell}</td>
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
      </div>


      {/* Modal para editar producto */}
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
            <label>Stock inicial:</label>
            <input
              type="number"
              name="stock_initial"
              value={formValues.stock_initial}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Stock actual:</label>
            <input
              type="number"
              name="stock_current"
              value={formValues.stock_current}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Precio compra:</label>
            <input
              type="number"
              step="0.01"
              name="price_purchase"
              value={formValues.price_purchase}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Precio venta:</label>
            <input
              type="number"
              step="0.01"
              name="price_sell"
              value={formValues.price_sell}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="edit-product-button">
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

export default Inventory;
