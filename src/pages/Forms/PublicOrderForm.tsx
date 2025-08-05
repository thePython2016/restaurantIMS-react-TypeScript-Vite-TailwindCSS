import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PublicOrderForm = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(true);

  useEffect(() => {
    setLoadingMenu(true);
    axios.get('/api/menu/')
      .then(res => {
        // Ensure we're setting an array
        const data = res.data;
        if (Array.isArray(data)) {
          setMenuItems(data);
        } else if (data && Array.isArray(data.results)) {
          setMenuItems(data.results);
        } else {
          console.warn('Unexpected API response format:', data);
          setMenuItems([]);
        }
      })
      .catch(err => {
        console.error('Failed to load menu:', err);
        // For demo purposes, add some sample menu items if API fails
        setMenuItems([
          { id: 1, name: 'Chicken Burger', description: 'Delicious chicken burger with fries', price: 5000 },
          { id: 2, name: 'Pizza Margherita', description: 'Classic Italian pizza with tomato and mozzarella', price: 8000 },
          { id: 3, name: 'French Fries', description: 'Crispy golden fries', price: 2000 },
          { id: 4, name: 'Soft Drink', description: 'Refreshing soft drink', price: 1000 },
        ]);
      })
      .finally(() => setLoadingMenu(false));
  }, []);

  const addToCart = (item) => {
    const existing = cart.find(ci => ci.id === item.id);
    if (existing) {
      setCart(cart.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, amount) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        customer_name: customerInfo.name,
        contact_number: customerInfo.phone,
        address: customerInfo.address,
        order_items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity
        })),
        order_type: 'delivery',
        order_source: 'online',
      };
      await axios.post('/api/orders/', payload);
      setSuccessMessage('✅ Order placed successfully! We will contact you soon.');
      setCart([]);
      setCustomerInfo({ name: '', phone: '', address: '' });
    } catch (error) {
      alert('❌ Failed to submit order. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Ensure menuItems is always an array
  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">🍕 Online Food Ordering</h1>
          <p className="text-gray-600 mt-2">Order delicious food online - No account required!</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Our Menu</h2>
            
            {loadingMenu ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading menu...</p>
              </div>
            ) : safeMenuItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No menu items available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {safeMenuItems.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-bold text-lg text-green-600">{item.price.toLocaleString()} TZS</span>
                      <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800">🛒 Your Cart</h2>
              
              {cart.length === 0 ? (
                <div>
                  <p className="text-gray-500 text-center py-8">No items in cart.</p>
                  
                  {/* Phone Number Field - Always Visible for Marketing */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-bold mb-3 text-gray-800">📞 Contact Information</h3>
                    <p className="text-sm text-gray-600 mb-3">Enter your phone number to receive updates and special offers!</p>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={customerInfo.phone}
                      onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.price.toLocaleString()} TZS each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button 
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">{cart.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString()} TZS</span>
                    </div>
                  </div>

                  {/* Customer Info Form */}
                  <form onSubmit={handleSubmit} className="mt-6">
                    <h3 className="font-bold mb-4 text-gray-800">🧍 Delivery Information</h3>
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      className="block mb-3 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={customerInfo.name}
                      onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      className="block mb-3 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={customerInfo.phone}
                      onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    />
                    <textarea
                      placeholder="Delivery Address"
                      required
                      rows={3}
                      className="block mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={customerInfo.address}
                      onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicOrderForm;
