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
    name: "",
    description: "",
    category_id: 0,
    supplier_id: 0,
  });

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
    const { name, description, category_id, supplier_id } = formValues;

    try {
      await invoke("create_product", {
        name,
        description,
        categoryId: parseInt(category_id),
        supplierId: parseInt(supplier_id),
      });
      fetchProducts(); // Recargar la lista de productos después de agregar uno nuevo
      handleCloseModal();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
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
                <td>{getCategoryName(product.category_id)}</td>
                <td>{getSupplierName(product.supplier_id)}</td>
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
    </div>
  );
};

export default Products;
