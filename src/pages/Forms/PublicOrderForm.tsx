import React, { useState, useEffect } from 'react';

const PublicOrderForm = () => {
  const [cart, setCart] = useState([]);
  const id = 1;
  const amount = 1;

  // Your exact function preserved
  useEffect(() => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <h1 className="text-3xl font-bold text-gray-800">
        Restaurant Information Management System
      </h1>
    </div>
  );
};

export default PublicOrderForm;
