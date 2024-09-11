"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { showTemporaryMessage } from '@/utils/helpers';

function ItemForm() {
  const { token } = useAuth();  // Hämta JWT-token från AuthContext
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);  // Standardvärde på 0
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);  // För att hantera uppdatering
  const [isCreating, setIsCreating] = useState(false);  // För att hantera skapandet
  const [messageType, setMessageType] = useState("");

  // State för att hålla valda kategorier för filtrering
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStock, setInStock] = useState(""); // "true", "false", eller ""

  // Funktion för att hämta alla items (initialt)
  useEffect(() => {
    fetchItems();
  }, [token]);

  // Funktion för att hämta items baserat på filter
  async function fetchItems(queryParams = "") {
    try {
      const response = await fetch(`/api/items${queryParams}`, {
        headers: {
          "Authorization": `Bearer ${token}`,  // Skickar JWT-token för autentisering
        },
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data);  // Sätter de hämtade items i state
      } else {
        const errorData = await response.json();
        showTemporaryMessage(setError, errorData.message || "Failed to fetch items.", 3000);
      }
    } catch (error) {
      showTemporaryMessage(setError, "An error occurred while fetching items.", 3000);
      console.error("Error fetching items:", error);
    }
  }

  // Funktion för att hantera kategoriändring med checkboxar
  function handleCategoryChange(e) {
    const { value, checked } = e.target;
    setSelectedCategories((prevCategories) =>
      checked ? [...prevCategories, value] : prevCategories.filter((category) => category !== value)
    );
  }

  // Funktion för att hantera lagerstatusändring
  function handleStockStatusChange(e) {
    setInStock(e.target.value);
  }

  // Funktion för att trigga filtreringen
  async function handleFilter() {
    const queryParams = new URLSearchParams();

    // Kolla om några kategorier är valda
    if (selectedCategories.length > 0) {
      // Encode kategorier för att hantera specialtecken
      queryParams.append('categories', selectedCategories.map(cat => encodeURIComponent(cat)).join(','));
    }

    // Kolla om lagerstatus är valt
    if (inStock !== "") {
      queryParams.append('inStock', inStock);
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    await fetchItems(queryString);
  }


  // Funktion för att lägga till eller uppdatera ett item
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsCreating(true); // Sätter denna till true om man håller på att skapa item

    // Validera att alla fält är ifyllda
    if (!name.trim() || !description.trim() || !category.trim()) {
      showTemporaryMessage(setError, "All fields must be filled in.", 3000);
      setIsCreating(false);
      return;
    }

    // Validera att quantity är ett giltigt nummer och större än eller lika med 0
    if (isNaN(quantity) || quantity < 0) {
      showTemporaryMessage(setError, "Quantity must be a number greater than or equal to 0.", 3000);
      setIsCreating(false);
      return;
    }

    const method = editingItemId ? "PUT" : "POST";  // Väljer metod beroende på om man uppdaterar eller skapar ett item
    const endpoint = editingItemId ? `/api/items/${editingItemId}` : "/api/items";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // Skicka JWT-token
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          quantity,
          category: category.trim(),
        }),
      });

      if (response.ok) {
        const newItem = await response.json();
        if (editingItemId) {
          setItems(items.map((item) => (item.id === editingItemId ? newItem : item)));  // Uppdaterar items i listan
          setMessageType("update");  // Ställer in typen av meddelande som "update"
          showTemporaryMessage(setSuccess, "Item updated successfully!", 3000);  // Visar rätt meddelande vid uppdatering
          setEditingItemId(null);  // Nollställer uppdateringsläget
        } else {
          setItems([...items, newItem]);  // Lägg till nytt item i listan
          setMessageType("create");  // Ställer in typen av meddelande som "create"
          showTemporaryMessage(setSuccess, "Item created successfully!", 3000);  // Visar rätt meddelande vid skapande
        }
        setName("");
        setDescription("");
        setQuantity(0);
        setCategory("");
      } else {
        const errorData = await response.json();
        setMessageType("error");  // Ställer in typen av meddelande som "error" vid fel
        showTemporaryMessage(setError, errorData.message || "Failed to create/update item.", 3000);
      }
    } catch (error) {
      showTemporaryMessage(setError, "An error occurred while creating/updating item.", 3000);
      console.error("Error creating/updating item:", error);
    }
    setIsCreating(false);  // När man lägger till item kommer man inte ska kunna interagera med delete och edit
  }

  // Funktion för att hantera borttagning av item (DELETE)
  async function handleDelete(itemId) {
    const response = await fetch(`/api/items/${itemId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,  // Skickar JWT-token
      },
    });

    if (response.ok) {
      setItems(items.filter((item) => item.id !== itemId));  // Tar bort itemet från listan
      setMessageType("delete");
      showTemporaryMessage(setSuccess, "Item deleted successfully!", 3000);
    } else {
      const errorData = await response.json();
      showTemporaryMessage(setError, "Failed to delete item.", 3000);
      console.error("Failed to delete item:", errorData);
    }
  }

  // Funktion för att hantera redigering (PUT)
  function handleEdit(item) {
    if (isCreating) return;  // Blockera redigering om man håller på att skapa ett item
    setEditingItemId(item.id);
    setName(item.name);
    setDescription(item.description);
    setQuantity(item.quantity);
    setCategory(item.category);
  }

  return (
    <div>
      <h2>{editingItemId ? "Update Item" : "Create a new Item"}</h2>

      {/* Dynamiskt meddelande med olika färger beroende på messageType */}
      {error && (
        <p className="text-red-600">{error}</p>
      )}
      {success && (
        <p
          className={`${messageType === "delete" ? "text-red-800" : "text-green-800"
            }`}
        >
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border rounded px-2 py-1 break-word"
          />
        </div>
        <div>
          <label>Quantity</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => {
              const value = e.target.value;
              // Kontrollera att endast siffror anges
              if (/^\d*$/.test(value)) {
                setQuantity(value === "" ? "" : Number(value));
              }
            }}
            pattern="[0-9]*"  // Tillåt bara siffror
            required
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="border rounded px-2 py-1"
          >
            <option value="">Select Category</option>
            <option value="Mobile">Mobile</option>
            <option value="Computers">Computers</option>
            <option value="TV/Audio">TV/Audio</option>
            <option value="Gaming">Gaming</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ml-2"
        >
          {editingItemId ? "Update Item" : "Create Item"}
        </button>
      </form>

      {/* Filtreringen  */}
      <div className="mt-8">
        <h2 className="font-extrabold">Filter Items</h2>
        <div className="mb-4">
          <h3 className="font-italic">Filter by Categories:</h3>
          <div>
            <label>
              <input
                type="checkbox"
                value="Mobile"
                onChange={handleCategoryChange}
                checked={selectedCategories.includes("Mobile")}
              />
              Mobile
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="Computers"
                onChange={handleCategoryChange}
                checked={selectedCategories.includes("Computers")}
              />
              Computers
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="TV/Audio"
                onChange={handleCategoryChange}
                checked={selectedCategories.includes("TV/Audio")}
              />
              TV/Audio
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="Gaming"
                onChange={handleCategoryChange}
                checked={selectedCategories.includes("Gaming")}
              />
Gaming            </label>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-extrabold">Filter by Stock Status:</h3>
          <label>
            <input
              type="radio"
              name="stockStatus"
              value="true"
              checked={inStock === "true"}
              onChange={handleStockStatusChange}
            />
            In Stock
          </label>
          <label className="ml-4">
            <input
              type="radio"
              name="stockStatus"
              value="false"
              checked={inStock === "false"}
              onChange={handleStockStatusChange}
            />
            Out of Stock
          </label>
          <label className="ml-4">
            <input
              type="radio"
              name="stockStatus"
              value=""
              checked={inStock === ""}
              onChange={handleStockStatusChange}
            />
            All
          </label>
        </div>

        <button
          onClick={handleFilter}
          className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Apply Filter
        </button>
      </div>

      <h2 className=" mt-10 md-5 font-extrabold ">Items List</h2>
      <table className="min-w-full bg-white mb-28">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Description</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id} className="border-b ml-5">
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.description}</td>
                <td>{item.category}</td>
                <td>
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-700 hover:bg-yellow-900 text-white px-4 py-2 rounded"
                    disabled={isCreating}  // Inaktiverar Edit om man skapar ett item
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-white bg-red-700 hover:bg-red-900 px-4 py-2 rounded"
                    disabled={isCreating}  // Inaktiverar Delete om man skapar ett item
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No items found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ItemForm;
