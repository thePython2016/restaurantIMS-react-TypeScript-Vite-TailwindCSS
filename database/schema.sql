-- =====================================================
-- MySQL Database Schema for React Admin Dashboard
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS react_admin_db;
USE react_admin_db;

-- =====================================================
-- USERS TABLE (Authentication)
-- =====================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role ENUM('admin', 'manager', 'staff', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- STAFF TABLE
-- =====================================================
CREATE TABLE staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(50),
    department VARCHAR(50),
    hire_date DATE,
    salary DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    profile_image VARCHAR(255),
    address TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- CUSTOMERS TABLE
-- =====================================================
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_code VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    customer_type ENUM('regular', 'vip', 'wholesale') DEFAULT 'regular',
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0.00,
    last_order_date TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- CATEGORIES TABLE (for menu items)
-- =====================================================
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- MENU ITEMS TABLE
-- =====================================================
CREATE TABLE menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT,
    price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    preparation_time INT, -- in minutes
    calories INT,
    allergens TEXT,
    ingredients TEXT,
    nutritional_info JSON,
    stock_quantity INT DEFAULT 0,
    reorder_level INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INT,
    staff_id INT,
    order_type ENUM('dine_in', 'takeaway', 'delivery') DEFAULT 'dine_in',
    order_status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP NULL,
    delivery_address TEXT,
    delivery_phone VARCHAR(20),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'card', 'online', 'mobile') DEFAULT 'cash',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL
);

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- =====================================================
-- INVOICES TABLE
-- =====================================================
CREATE TABLE invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(20) UNIQUE NOT NULL,
    order_id INT,
    customer_id INT,
    invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
    payment_terms VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- =====================================================
-- SALES TABLE (for tracking daily/monthly sales)
-- =====================================================
CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    total_cost DECIMAL(12,2) DEFAULT 0.00,
    gross_profit DECIMAL(12,2) DEFAULT 0.00,
    tax_collected DECIMAL(10,2) DEFAULT 0.00,
    discounts_given DECIMAL(10,2) DEFAULT 0.00,
    net_profit DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date)
);

-- =====================================================
-- INVENTORY TABLE (for stock management)
-- =====================================================
CREATE TABLE inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    menu_item_id INT,
    quantity_in_stock INT DEFAULT 0,
    quantity_reserved INT DEFAULT 0,
    quantity_available INT GENERATED ALWAYS AS (quantity_in_stock - quantity_reserved) STORED,
    last_restocked TIMESTAMP NULL,
    next_restock_date DATE,
    supplier_name VARCHAR(100),
    supplier_contact VARCHAR(100),
    unit_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- =====================================================
-- AUDIT LOG TABLE (for tracking changes)
-- =====================================================
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- SETTINGS TABLE (for app configuration)
-- =====================================================
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Staff indexes
CREATE INDEX idx_staff_email ON staff(email);
CREATE INDEX idx_staff_employee_id ON staff(employee_id);
CREATE INDEX idx_staff_department ON staff(department);

-- Customers indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_customer_code ON customers(customer_code);
CREATE INDEX idx_customers_customer_type ON customers(customer_type);

-- Menu items indexes
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_featured ON menu_items(is_featured);

-- Orders indexes
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_staff ON orders(staff_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Order items indexes
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item ON order_items(menu_item_id);

-- Invoices indexes
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);

-- Sales indexes
CREATE INDEX idx_sales_date ON sales(date);

-- Inventory indexes
CREATE INDEX idx_inventory_menu_item ON inventory(menu_item_id);
CREATE INDEX idx_inventory_available ON inventory(quantity_available);

-- Audit log indexes
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_date ON audit_log(created_at);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, first_name, last_name, role) 
VALUES ('admin', 'admin@example.com', '$2b$10$rQZ8K9mN2pL1vX3yA6bC7dE8fG9hI0jK1lM2nO3pQ4rS5tU6vW7xY8zA9bC0dE', 'Admin', 'User', 'admin');

-- Insert sample categories
INSERT INTO categories (name, description, sort_order) VALUES
('Appetizers', 'Start your meal with our delicious appetizers', 1),
('Main Course', 'Our signature main dishes', 2),
('Desserts', 'Sweet endings to your meal', 3),
('Beverages', 'Refreshing drinks and cocktails', 4);

-- Insert sample menu items
INSERT INTO menu_items (item_code, name, description, category_id, price, cost_price, is_available) VALUES
('APP001', 'Bruschetta', 'Toasted bread with tomatoes and herbs', 1, 8.99, 3.50, TRUE),
('APP002', 'Mozzarella Sticks', 'Crispy mozzarella with marinara sauce', 1, 7.99, 3.00, TRUE),
('MAIN001', 'Grilled Salmon', 'Fresh salmon with seasonal vegetables', 2, 24.99, 12.00, TRUE),
('MAIN002', 'Beef Tenderloin', 'Premium beef with garlic mashed potatoes', 2, 29.99, 15.00, TRUE),
('DESS001', 'Tiramisu', 'Classic Italian dessert', 3, 9.99, 4.00, TRUE),
('BEV001', 'Fresh Lemonade', 'Homemade lemonade', 4, 4.99, 1.50, TRUE);

-- Insert sample staff
INSERT INTO staff (employee_id, first_name, last_name, email, phone, position, department) VALUES
('EMP001', 'John', 'Doe', 'john.doe@restaurant.com', '555-0101', 'Manager', 'Management'),
('EMP002', 'Jane', 'Smith', 'jane.smith@restaurant.com', '555-0102', 'Server', 'Service'),
('EMP003', 'Mike', 'Johnson', 'mike.johnson@restaurant.com', '555-0103', 'Chef', 'Kitchen');

-- Insert sample customers
INSERT INTO customers (customer_code, first_name, last_name, email, phone, customer_type) VALUES
('CUST001', 'Alice', 'Brown', 'alice.brown@email.com', '555-0201', 'regular'),
('CUST002', 'Bob', 'Wilson', 'bob.wilson@email.com', '555-0202', 'vip'),
('CUST003', 'Carol', 'Davis', 'carol.davis@email.com', '555-0203', 'regular');

-- Insert sample settings
INSERT INTO settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('restaurant_name', 'Fine Dining Restaurant', 'string', 'Name of the restaurant', TRUE),
('tax_rate', '8.5', 'number', 'Sales tax rate percentage', TRUE),
('currency', 'USD', 'string', 'Default currency', TRUE),
('timezone', 'America/New_York', 'string', 'Restaurant timezone', TRUE);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Trigger to update customer order count and total spent
DELIMITER //
CREATE TRIGGER after_order_complete
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.order_status = 'delivered' AND OLD.order_status != 'delivered' THEN
        UPDATE customers 
        SET total_orders = total_orders + 1,
            total_spent = total_spent + NEW.total_amount,
            last_order_date = NEW.order_date
        WHERE id = NEW.customer_id;
    END IF;
END//
DELIMITER ;

-- Trigger to update inventory when order is placed
DELIMITER //
CREATE TRIGGER after_order_item_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE inventory 
    SET quantity_reserved = quantity_reserved + NEW.quantity
    WHERE menu_item_id = NEW.menu_item_id;
END//
DELIMITER ;

-- Trigger to update inventory when order is cancelled
DELIMITER //
CREATE TRIGGER after_order_cancelled
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.order_status = 'cancelled' AND OLD.order_status != 'cancelled' THEN
        UPDATE inventory i
        JOIN order_items oi ON i.menu_item_id = oi.menu_item_id
        SET i.quantity_reserved = i.quantity_reserved - oi.quantity
        WHERE oi.order_id = NEW.id;
    END IF;
END//
DELIMITER ;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for order summary
CREATE VIEW order_summary AS
SELECT 
    o.id,
    o.order_number,
    CONCAT(c.first_name, ' ', c.last_name) as customer_name,
    CONCAT(s.first_name, ' ', s.last_name) as staff_name,
    o.order_status,
    o.total_amount,
    o.order_date
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
LEFT JOIN staff s ON o.staff_id = s.id;

-- View for menu items with category
CREATE VIEW menu_items_with_category AS
SELECT 
    mi.*,
    c.name as category_name
FROM menu_items mi
LEFT JOIN categories c ON mi.category_id = c.id
WHERE mi.is_available = TRUE;

-- View for inventory status
CREATE VIEW inventory_status AS
SELECT 
    mi.name as item_name,
    mi.item_code,
    i.quantity_in_stock,
    i.quantity_reserved,
    i.quantity_available,
    CASE 
        WHEN i.quantity_available <= mi.reorder_level THEN 'Low Stock'
        WHEN i.quantity_available = 0 THEN 'Out of Stock'
        ELSE 'In Stock'
    END as stock_status
FROM inventory i
JOIN menu_items mi ON i.menu_item_id = mi.id;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Procedure to get daily sales report
DELIMITER //
CREATE PROCEDURE GetDailySalesReport(IN report_date DATE)
BEGIN
    SELECT 
        DATE(o.order_date) as order_date,
        COUNT(o.id) as total_orders,
        SUM(o.total_amount) as total_revenue,
        AVG(o.total_amount) as average_order_value
    FROM orders o
    WHERE DATE(o.order_date) = report_date
    AND o.order_status = 'delivered'
    GROUP BY DATE(o.order_date);
END//
DELIMITER ;

-- Procedure to get low stock items
DELIMITER //
CREATE PROCEDURE GetLowStockItems()
BEGIN
    SELECT 
        mi.name,
        mi.item_code,
        i.quantity_available,
        mi.reorder_level
    FROM inventory i
    JOIN menu_items mi ON i.menu_item_id = mi.id
    WHERE i.quantity_available <= mi.reorder_level
    ORDER BY i.quantity_available ASC;
END//
DELIMITER ;

-- Procedure to get customer order history
DELIMITER //
CREATE PROCEDURE GetCustomerOrderHistory(IN customer_id INT)
BEGIN
    SELECT 
        o.order_number,
        o.order_date,
        o.total_amount,
        o.order_status,
        GROUP_CONCAT(mi.name SEPARATOR ', ') as items_ordered
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN menu_items mi ON oi.menu_item_id = mi.id
    WHERE o.customer_id = customer_id
    GROUP BY o.id
    ORDER BY o.order_date DESC;
END//
DELIMITER ;

-- =====================================================
-- END OF SCHEMA
-- ===================================================== 