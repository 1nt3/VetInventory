import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Modal from "../Modal";
import "./Products.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    category_id: 0,
    supplier_id: 0,
  });
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para el producto seleccionado

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
    setIsAddModalOpen(true);
  };

  const handleEditButtonClick = (product) => {
    setSelectedProduct(product);
    setFormValues({
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      supplier_id: product.supplier_id,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setFormValues({
      name: "",
      description: "",
      category_id: 0,
      supplier_id: 0,
    });
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
    setFormValues({
      name: "",
      description: "",
      category_id: 0,
      supplier_id: 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleAddSubmit = async (e) => {
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
      handleCloseAddModal();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { name, description, category_id, supplier_id } = formValues;

    try {
      await invoke("update_product", {
        id: selectedProduct.id,
        name,
        description,
        categoryId: parseInt(category_id),
        supplierId: parseInt(supplier_id),
      });
      fetchProducts(); // Recargar la lista de productos después de editar
      handleCloseEditModal();
    } catch (error) {
      console.error("Error al editar el producto:", error);
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
                  <button onClick={() => handleEditButtonClick(product)}>
                    Editar
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
        onClose={handleCloseAddModal}
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

      {/* Modal para editar producto */}
      <Modal
        title="Editar Producto"
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
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

export default Product;
