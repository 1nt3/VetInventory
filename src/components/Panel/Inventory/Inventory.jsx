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
    price_purchase: 0.0,
    price_sell: 0.0,
    stock_initial: 0,
    stock_current: 0,
  };

  const [products, setProducts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(initialProductFormValues);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setProducts(await fetchProducts());
    };
    loadData();
  }, []);

  const handleEditButtonClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
    setFormValues({
      name: product.name,
      price_purchase: product.price_purchase,
      price_sell: product.price_sell,
      stock_initial: product.stock_initial,
      stock_current: product.stock_current,
    });
  };

  const handleDeleteButtonClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProductInventory(selectedProduct.id, formValues);
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

  const updateProductInventory = async (productId, product) => {
    try {
      const { name, price_purchase, price_sell, stock_initial, stock_current } =
        product;

      const pricePurchase = parseFloat(price_purchase);
      const priceSell = parseFloat(price_sell);
      const stockInitial = parseInt(stock_initial);
      const stockCurrent = parseInt(stock_current);
      const response = await invoke("update_inventory", {
        productId,
        name,
        pricePurchase,
        priceSell,
        stockInitial,
        stockCurrent,
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

  return (
    <div className="inventory">
      <p className="inventory-title">Existencias</p>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio compra</th>
            <th>Precio venta</th>
            <th>Stock inicial</th>
            <th>Stock actual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="inventory-body">
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.price_purchase}</td>
              <td>{product.price_sell}</td>
              <td>{product.stock_initial}</td>
              <td>{product.stock_current}</td>
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

      {/* Modal para editar producto */}
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
