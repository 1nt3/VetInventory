/* ESTE COMPONENTE ES SOLO PARA TESTEO */

import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const ProductEntry = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categoryId, setCategoryId] = useState(1); // SOLO DE EJEMPLO, ELIMINAR DESPUES
  const [supplierId, setSupplierId] = useState(1); // SOLO DE EJEMPLO, ELIMINAR DESPUES

  useEffect(() => {
    //fetchCategories();
    //fetchSuppliers();
  }, []);

  /*
  const fetchCategories = async () => {
    try {
      const response = await invoke("get_categories");
      setCategories(response);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await invoke("get_suppliers");
      setSuppliers(response);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    }
  };
  */

  const createProduct = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const newProduct = await invoke("create_product", {
        name,
        description,
        categoryId,
        supplierId,
        //category,
        //supplier,
      });
      setSuccessMessage("Product created successfully!");
      // Optionally, update state or perform other actions upon successful product creation
    } catch (error) {
      setError("Failed to create product. Please try again. " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Supplier:
          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          >
            <option value="">Select a supplier</option>
            {suppliers.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Creating Product..." : "Create Product"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </form>
    </div>
  );
};

export default ProductEntry;
