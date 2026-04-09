-- Fancy Day Dream Database Schema
-- Optimized for XAMPP / MySQL

CREATE DATABASE IF NOT EXISTS fancy_day_dream;
USE fancy_day_dream;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    discount_pct INT DEFAULT 0,
    image_url VARCHAR(255),
    status ENUM('active', 'sale', 'sold_out') DEFAULT 'active',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10, 2),
    status ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. CRAFT / CART ITEMS (Temporary storage usually, but can be persisted)
CREATE TABLE IF NOT EXISTS craft_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    custom_details JSON,  -- For Studio configurations (color, fabric, silhouette)
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- INSERT INITIAL ADMIN
-- Note: In a real app, use password_verify(). This is for structure.
INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@fancydaydream.com', 'admin_hash_placeholder', 'admin');

-- INSERT INITIAL PRODUCTS
INSERT INTO products (name, category, base_price, discount_pct, image_url, status) 
VALUES 
('Structured Denim Project', 'Outerwear', 89.99, 33, '1.jpg', 'sale'),
('Heavyweight Cotton Base', 'Essentials', 24.99, 0, '2.jpg', 'active'),
('Shadow Pullover', 'Fleece', 65.00, 23, '3.jpg', 'sale'),
('Utility Cargo Pant', 'Bottoms', 69.99, 0, '4.jpg', 'active'),
('Minimalist Trainer', 'Footwear', 120.00, 25, '5.jpg', 'sale');
