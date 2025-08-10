# Manual Database Import Guide
## Restaurant Management System - rest_db.sql

This guide provides step-by-step instructions for manually importing the `rest_db.sql` database schema into MySQL.

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ MySQL Server installed (version 8.0 or higher)
- ✅ MySQL command line client or MySQL Workbench
- ✅ Administrator access to MySQL
- ✅ The `rest_db.sql` file in your working directory

---

## 🚀 Method 1: MySQL Command Line

### Step 1: Connect to MySQL
```bash
# Connect as root user
mysql -u root -p

# Enter your MySQL root password when prompted
```

### Step 2: Create and Use Database
```sql
-- Create the database
CREATE DATABASE IF NOT EXISTS rest_db;

-- Switch to the database
USE rest_db;
```

### Step 3: Import Schema
```sql
-- Import the schema file
source rest_db.sql;
```

### Step 4: Verify Import
```sql
-- Check if tables were created
SHOW TABLES;

-- Verify sample data
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as menu_items FROM menu_items;
SELECT COUNT(*) as customers FROM customers;
```

---

## 🖥️ Method 2: MySQL Workbench

### Step 1: Open MySQL Workbench
1. Launch MySQL Workbench
2. Connect to your MySQL server
3. Open a new query tab

### Step 2: Create Database
```sql
CREATE DATABASE IF NOT EXISTS rest_db;
USE rest_db;
```

### Step 3: Import Schema File
1. Go to **File** → **Open SQL Script**
2. Navigate to and select `rest_db.sql`
3. Click **Open**
4. Click the lightning bolt icon (⚡) to execute the script

### Step 4: Verify Import
```sql
-- Check tables
SHOW TABLES;

-- Check sample data
SELECT * FROM users LIMIT 5;
SELECT * FROM menu_items LIMIT 5;
```

---

## 💻 Method 3: Command Line (Non-Interactive)

### Step 1: Direct Import
```bash
# Import directly from command line
mysql -u root -p < rest_db.sql
```

### Step 2: Verify Import
```bash
# Connect and verify
mysql -u root -p -e "USE rest_db; SHOW TABLES;"
```

---

## 🔧 Method 4: phpMyAdmin

### Step 1: Access phpMyAdmin
1. Open your web browser
2. Navigate to phpMyAdmin (usually `http://localhost/phpmyadmin`)
3. Login with your MySQL credentials

### Step 2: Create Database
1. Click **New** in the left sidebar
2. Enter `rest_db` as database name
3. Click **Create**

### Step 3: Import Schema
1. Select the `rest_db` database
2. Click the **Import** tab
3. Click **Choose File** and select `rest_db.sql`
4. Click **Go** to import

---

## ✅ Verification Steps

After successful import, verify the following:

### 1. Check Database Structure
```sql
USE rest_db;
SHOW TABLES;
```

**Expected Tables:**
- users
- staff
- customers
- categories
- menu_items
- orders
- order_items
- invoices
- sales
- inventory
- audit_log
- settings

### 2. Verify Sample Data
```sql
-- Check users
SELECT username, email, role FROM users;

-- Check menu items
SELECT name, price, category_id FROM menu_items LIMIT 5;

-- Check customers
SELECT first_name, last_name, customer_type FROM customers LIMIT 5;

-- Check staff
SELECT first_name, last_name, position FROM staff LIMIT 5;
```

### 3. Test Default Login
```sql
-- Verify admin user exists
SELECT username, email, role FROM users WHERE username = 'admin';
```

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

---

## 🛠️ Troubleshooting

### Issue 1: Access Denied
```bash
# Error: Access denied for user 'root'@'localhost'
```
**Solution:**
```bash
# Connect with sudo (Linux/Mac)
sudo mysql -u root

# Or reset MySQL root password
sudo mysql_secure_installation
```

### Issue 2: Database Already Exists
```sql
-- Error: Can't create database 'rest_db'; database exists
```
**Solution:**
```sql
-- Drop existing database (WARNING: This will delete all data)
DROP DATABASE IF EXISTS rest_db;
CREATE DATABASE rest_db;
USE rest_db;
source rest_db.sql;
```

### Issue 3: File Not Found
```bash
# Error: Can't open file 'rest_db.sql'
```
**Solution:**
```bash
# Check current directory
pwd
ls -la rest_db.sql

# Navigate to correct directory
cd /path/to/your/project
```

### Issue 4: Syntax Errors
```sql
-- Error: You have an error in your SQL syntax
```
**Solution:**
1. Check MySQL version compatibility
2. Ensure proper character encoding (UTF-8)
3. Verify file integrity

---

## 🔐 Security Setup

### 1. Create Application User
```sql
-- Create dedicated user for application
CREATE USER 'rest_app'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON rest_db.* TO 'rest_app'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;
```

### 2. Update Application Configuration
Update your application's database configuration:
```env
DB_HOST=localhost
DB_USER=rest_app
DB_PASSWORD=your_secure_password
DB_NAME=rest_db
DB_PORT=3306
```

---

## 📊 Database Overview

### Tables and Their Purposes:

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `users` | Authentication | Login, roles, permissions |
| `staff` | Employee management | HR data, performance |
| `customers` | Customer database | CRM, order history |
| `categories` | Menu organization | Product grouping |
| `menu_items` | Product catalog | Pricing, inventory |
| `orders` | Order processing | Status tracking |
| `order_items` | Order details | Line items, quantities |
| `invoices` | Billing system | Payment tracking |
| `sales` | Analytics | Daily/monthly reports |
| `inventory` | Stock management | Quantity tracking |
| `audit_log` | Change tracking | Security, compliance |
| `settings` | Configuration | App settings |

### Sample Data Included:
- ✅ 1 Admin user
- ✅ 5 Staff members
- ✅ 5 Customers
- ✅ 5 Menu categories
- ✅ 12 Menu items
- ✅ 6 Application settings
- ✅ 12 Inventory records

---

## 🚀 Next Steps

After successful import:

1. **Update Default Passwords**
   ```sql
   -- Change admin password
   UPDATE users SET password_hash = 'new_hashed_password' WHERE username = 'admin';
   ```

2. **Configure Application**
   - Update database connection settings
   - Set up environment variables
   - Configure JWT secrets

3. **Test Application**
   - Start your React application
   - Test login with admin credentials
   - Verify all features work correctly

4. **Backup Database**
   ```bash
   mysqldump -u root -p rest_db > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

---

## 📞 Support

If you encounter issues during import:

1. Check MySQL error logs
2. Verify MySQL version compatibility
3. Ensure sufficient disk space
4. Check file permissions
5. Review troubleshooting section above

**Common Error Codes:**
- `1044`: Access denied
- `1049`: Database doesn't exist
- `1050`: Table already exists
- `1064`: Syntax error
- `2002`: Connection refused

---

## ✅ Success Checklist

- [ ] Database `rest_db` created successfully
- [ ] All 12 tables created without errors
- [ ] Sample data imported correctly
- [ ] Default admin user accessible
- [ ] Application can connect to database
- [ ] All features working properly
- [ ] Database backup created

**🎉 Congratulations! Your restaurant management database is ready to use.** 