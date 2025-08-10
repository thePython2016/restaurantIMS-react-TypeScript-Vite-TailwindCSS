// Database configuration for MySQL
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'react_admin_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Execute query with error handling
async function executeQuery(query, params = []) {
  try {
    const [rows] = await pool.execute(query, params);
    return { success: true, data: rows };
  } catch (error) {
    console.error('Query execution error:', error);
    return { success: false, error: error.message };
  }
}

// User authentication functions
const authQueries = {
  // Get user by username
  getUserByUsername: 'SELECT * FROM users WHERE username = ? AND is_active = TRUE',
  
  // Get user by email
  getUserByEmail: 'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
  
  // Create new user
  createUser: 'INSERT INTO users (username, email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)',
  
  // Update last login
  updateLastLogin: 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
  
  // Get user by ID
  getUserById: 'SELECT id, username, email, first_name, last_name, role, last_login FROM users WHERE id = ? AND is_active = TRUE'
};

// Staff management functions
const staffQueries = {
  // Get all staff
  getAllStaff: 'SELECT * FROM staff WHERE is_active = TRUE ORDER BY first_name, last_name',
  
  // Get staff by ID
  getStaffById: 'SELECT * FROM staff WHERE id = ?',
  
  // Create staff member
  createStaff: 'INSERT INTO staff (employee_id, first_name, last_name, email, phone, position, department, hire_date, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
  
  // Update staff member
  updateStaff: 'UPDATE staff SET first_name = ?, last_name = ?, email = ?, phone = ?, position = ?, department = ?, salary = ?, is_active = ? WHERE id = ?',
  
  // Delete staff member (soft delete)
  deleteStaff: 'UPDATE staff SET is_active = FALSE WHERE id = ?'
};

// Customer management functions
const customerQueries = {
  // Get all customers
  getAllCustomers: 'SELECT * FROM customers WHERE is_active = TRUE ORDER BY first_name, last_name',
  
  // Get customer by ID
  getCustomerById: 'SELECT * FROM customers WHERE id = ?',
  
  // Create customer
  createCustomer: 'INSERT INTO customers (customer_code, first_name, last_name, email, phone, address, city, state, postal_code, customer_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  
  // Update customer
  updateCustomer: 'UPDATE customers SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, postal_code = ?, customer_type = ? WHERE id = ?',
  
  // Delete customer (soft delete)
  deleteCustomer: 'UPDATE customers SET is_active = FALSE WHERE id = ?'
};

// Menu management functions
const menuQueries = {
  // Get all menu items
  getAllMenuItems: 'SELECT mi.*, c.name as category_name FROM menu_items mi LEFT JOIN categories c ON mi.category_id = c.id WHERE mi.is_available = TRUE ORDER BY mi.name',
  
  // Get menu item by ID
  getMenuItemById: 'SELECT mi.*, c.name as category_name FROM menu_items mi LEFT JOIN categories c ON mi.category_id = c.id WHERE mi.id = ?',
  
  // Create menu item
  createMenuItem: 'INSERT INTO menu_items (item_code, name, description, category_id, price, cost_price, preparation_time, stock_quantity, reorder_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
  
  // Update menu item
  updateMenuItem: 'UPDATE menu_items SET name = ?, description = ?, category_id = ?, price = ?, cost_price = ?, preparation_time = ?, stock_quantity = ?, reorder_level = ?, is_available = ? WHERE id = ?',
  
  // Delete menu item (soft delete)
  deleteMenuItem: 'UPDATE menu_items SET is_available = FALSE WHERE id = ?',
  
  // Get categories
  getCategories: 'SELECT * FROM categories WHERE is_active = TRUE ORDER BY sort_order, name'
};

// Order management functions
const orderQueries = {
  // Get all orders
  getAllOrders: `
    SELECT o.*, 
           CONCAT(c.first_name, ' ', c.last_name) as customer_name,
           CONCAT(s.first_name, ' ', s.last_name) as staff_name
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    LEFT JOIN staff s ON o.staff_id = s.id
    ORDER BY o.order_date DESC
  `,
  
  // Get order by ID with items
  getOrderById: `
    SELECT o.*, 
           CONCAT(c.first_name, ' ', c.last_name) as customer_name,
           CONCAT(s.first_name, ' ', s.last_name) as staff_name,
           oi.id as item_id,
           oi.quantity,
           oi.unit_price,
           oi.total_price,
           oi.special_instructions,
           mi.name as item_name
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    LEFT JOIN staff s ON o.staff_id = s.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
    WHERE o.id = ?
  `,
  
  // Create order
  createOrder: 'INSERT INTO orders (order_number, customer_id, staff_id, order_type, subtotal, tax_amount, discount_amount, total_amount, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
  
  // Update order status
  updateOrderStatus: 'UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
  
  // Add order item
  addOrderItem: 'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price, special_instructions) VALUES (?, ?, ?, ?, ?, ?)'
};

// Sales and reporting functions
const reportQueries = {
  // Get daily sales
  getDailySales: 'SELECT DATE(order_date) as date, COUNT(*) as total_orders, SUM(total_amount) as total_revenue FROM orders WHERE DATE(order_date) = ? AND order_status = "delivered" GROUP BY DATE(order_date)',
  
  // Get monthly sales
  getMonthlySales: 'SELECT YEAR(order_date) as year, MONTH(order_date) as month, COUNT(*) as total_orders, SUM(total_amount) as total_revenue FROM orders WHERE order_status = "delivered" GROUP BY YEAR(order_date), MONTH(order_date) ORDER BY year DESC, month DESC',
  
  // Get top selling items
  getTopSellingItems: `
    SELECT mi.name, mi.item_code, SUM(oi.quantity) as total_sold, SUM(oi.total_price) as total_revenue
    FROM order_items oi
    JOIN menu_items mi ON oi.menu_item_id = mi.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.order_status = 'delivered'
    GROUP BY mi.id
    ORDER BY total_sold DESC
    LIMIT 10
  `,
  
  // Get customer statistics
  getCustomerStats: 'SELECT customer_type, COUNT(*) as count, AVG(total_spent) as avg_spent FROM customers WHERE is_active = TRUE GROUP BY customer_type'
};

module.exports = {
  pool,
  testConnection,
  executeQuery,
  authQueries,
  staffQueries,
  customerQueries,
  menuQueries,
  orderQueries,
  reportQueries
}; 