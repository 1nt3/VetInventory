import { useState, useEffect } from "react";

const useProductActions = (fetchItems, createItem, updateItem, deleteItem) => {
  const [items, setItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    category_id: 0,
    supplier_id: 0,
  });

  useEffect(() => {
    const loadItems = async () => {
      const data = await fetchItems();
      setItems(data);
    };
    loadItems();
  }, [fetchItems]);

  const handleAddButtonClick = () => {
    setFormValues({
      name: "",
      description: "",
      category_id: 0,
      supplier_id: 0,
    });
    setIsAddModalOpen(true);
  };

  const handleEditButtonClick = (item) => {
    setFormValues(item);
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteButtonClick = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    await createItem(formValues);
    setIsAddModalOpen(false);
    setItems(await fetchItems());
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    await updateItem(formValues);
    setIsEditModalOpen(false);
    setItems(await fetchItems());
  };

  const handleDeleteSubmit = async (event) => {
    event.preventDefault();
    await deleteItem(selectedItem.id);
    setIsDeleteModalOpen(false);
    setItems(await fetchItems());
  };

  return {
    items,
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
  };
};

export default useProductActions;
