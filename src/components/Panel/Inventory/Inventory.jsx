import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./Inventory.css";
import Modal from "../../shared/Modal/Modal";

const updatePricesInventory = async (productId, product) => {
  try {
    const { price_purchase, price_sell } = product;

    const pricePurchase = parseFloat(price_purchase);
    const priceSell = parseFloat(price_sell);
    const response = await invoke("update_inventory", {
      productId,
      pricePurchase,
      priceSell,
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

const updateUtilityInventory = async (product, saleAmount) => {
  try {
    console.log(saleAmount);

    product.utility += calcularUtilidad(
      product.price_purchase,
      product.price_sell,
      saleAmount
    );

    product.stock_current -= saleAmount;

    const productId = product.id;
    const utility = product.utility;
    const stockCurrent = product.stock_current;

    const response = await invoke("update_utility_product", {
      productId,
      stockCurrent,
      utility,
    });
    return response;
  } catch (error) {
    console.error("Error updating utility:", error);
    throw error;
  }
};

// Función para calcular la utilidad
const calcularUtilidad = (price_purchase, price_sell, saleAmount) => {
  const utilidadBruta = 0.81 * (price_sell - price_purchase) * saleAmount;
  return utilidadBruta;
};

const Inventory = () => {
  const initialProductFormValues = {
    name: "",
    price_purchase: 0.0,
    price_sell: 0.0,
    stock_initial: 0,
    stock_current: 0,
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

  const [products, setProducts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false); // Nuevo estado para la modal de ventas
  const [formValues, setFormValues] = useState(initialProductFormValues);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saleAmount, setSaleAmount] = useState(0); // Estado para la cantidad de ventas

  useEffect(() => {
    const loadData = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };
    loadData();
  }, [fetchProducts]);

  const handleEditButtonClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteButtonClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleSaleButtonClick = (product) => {
    setSelectedProduct(product);
    setIsSaleModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsSaleModalOpen(false);
    setFormValues(initialProductFormValues);
    setSelectedProduct(null);
    setSaleAmount(0); // Reiniciar la cantidad de ventas
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSaleInputChange = (e) => {
    setSaleAmount(e.target.value);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePricesInventory(selectedProduct.id, formValues);
      handleCloseModal();
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await deleteProduct(selectedProduct.id);
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUtilityInventory(selectedProduct, saleAmount);

      handleCloseModal();
    } catch (error) {
      console.error("Error recording sale:", error);
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
            <th>Utilidad</th>
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
              <td>{product.utility.toFixed(2)}</td>
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

                <button
                  className="register-sale-button"
                  onClick={() => handleSaleButtonClick(product)}
                >
                  Registrar Venta
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

      {/* Modal para registrar venta */}
      <Modal
        title="Registrar Venta"
        isOpen={isSaleModalOpen}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSaleSubmit} className="form">
          <div className="form-group">
            <label>Cantidad vendida:</label>
            <input
              type="number"
              name="saleAmount"
              value={saleAmount}
              onChange={handleSaleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="sale-button">
              Registrar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
