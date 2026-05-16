import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Item {
  itemID: number;
  itemName: string;
  category: string;
}

interface MenuItemFormProps {
  onSubmit: (data: any) => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ onSubmit }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Fetch items from your Django API endpoint
    axios.get('/api/items/')
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const item = items.find(i => i.itemID === Number(e.target.value));
    setSelectedItem(item || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      onSubmit({ itemid: selectedItem.itemID, price, description });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="itemid" className="block font-medium">Item</label>
        <select id="itemid" onChange={handleItemChange} className="border rounded p-2 w-full">
          <option value="">Select an item</option>
          {items.map(item => (
            <option key={item.itemID} value={item.itemID}>
              {item.itemName}
            </option>
          ))}
        </select>
      </div>
      {selectedItem && (
        <div className="bg-gray-100 p-2 rounded">
          <div><strong>Category:</strong> {selectedItem.category}</div>
        </div>
      )}
      <div>
        <label htmlFor="price" className="block font-medium">Price</label>
        <input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block font-medium">Description (optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border rounded p-2 w-full"
          rows={2}
          placeholder="Enter a description (optional)"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Menu Item</button>
    </form>
  );
};

export default MenuItemForm;
