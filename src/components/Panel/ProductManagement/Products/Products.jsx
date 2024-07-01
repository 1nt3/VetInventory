import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Modal from "../Modal";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    category_id: 0,
    supplier_id: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await invoke("get_products");
      console.log(response);
      setProducts(response);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = formValues.name;
    const description = formValues.description;
    const categoryId = parseInt(formValues.category_id);
    const supplierId = parseInt(formValues.supplier_id);
    console.log("Datos del formulario:", formValues);

    try {
      await invoke("create_product", {
        name,
        description,
        categoryId,
        supplierId,
      });
      fetchProducts(); // Recargar la lista de productos después de agregar uno nuevo
      handleCloseModal();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
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
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.category_id}</td>
                <td>{product.supplier_id}</td>
                <td>{product.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title="Agregar Producto"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
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
            <input
              type="number"
              name="category_id"
              value={formValues.category_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Proveedor:</label>
            <input
              type="number"
              name="supplier_id"
              value={formValues.supplier_id}
              onChange={handleInputChange}
              required
            />
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
    </div>
  );
};

export default Products;
