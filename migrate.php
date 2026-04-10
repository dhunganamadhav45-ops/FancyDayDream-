<?php
require_once 'backend/config.php';

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "CREATE TABLE IF NOT EXISTS homepage_settings (
        id INT PRIMARY KEY DEFAULT 1,
        hero_title VARCHAR(255),
        hero_subtitle TEXT,
        hero_badge VARCHAR(100),
        slide1_url VARCHAR(255),
        slide2_url VARCHAR(255),
        slide3_url VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );";

    if ($conn->query($sql) === TRUE) {
        echo "Table homepage_settings created successfully or already exists.<br>";
    } else {
        echo "Error creating table: " . $conn->error . "<br>";
    }

    $check = $conn->query("SELECT * FROM homepage_settings WHERE id = 1");
    if ($check->num_rows == 0) {
        $insert = "INSERT INTO homepage_settings (id, hero_title, hero_subtitle, hero_badge, slide1_url, slide2_url, slide3_url) 
                   VALUES (1, 'Elevate Your Standard.', 'Experience true sartorial freedom. Engineer your own luxury streetwear through our sophisticated 3D browser-based studio.', 'The Future of Bespoke', '1.jpg', '2.jpg', '3.jpg')";
        if ($conn->query($insert) === TRUE) {
            echo "Default settings inserted.<br>";
        }
    }

    $conn->query("CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );");

    $conn->query("INSERT INTO gallery (image_url) VALUES ('1.jpg'), ('2.jpg'), ('3.jpg'), ('4.jpg'), ('5.jpg'), ('6.jpg')");

    // Orders Table
    $conn->query("CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        city VARCHAR(100),
        items TEXT,
        total_price DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );");

    // Users Table
    $conn->query("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );");

    $conn->close();
    echo "Migration complete.";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>
