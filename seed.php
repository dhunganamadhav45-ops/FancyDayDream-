<?php
require_once 'backend/config.php';

try {
    // Clear existing
    $pdo->query("DELETE FROM products");
    $pdo->query("DELETE FROM gallery");
    $pdo->query("ALTER TABLE products AUTO_INCREMENT = 1");
    $pdo->query("ALTER TABLE gallery AUTO_INCREMENT = 1");

    // Images
    $images = [
        'assets/img/studiowear_full.png',
        'assets/img/studiowear_current.png',
        'assets/img/initial_site.webp',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80'
    ];

    // Insert 5 Products
    $products = [
        ['name' => 'Nepali Custom Shell', 'category' => 'Outerwear', 'price' => 3500, 'discount' => 10],
        ['name' => 'Studio Design Hoodie', 'category' => 'Essentials', 'price' => 2800, 'discount' => 0],
        ['name' => 'Classic Black Joggers', 'category' => 'Bottoms', 'price' => 2200, 'discount' => 15],
        ['name' => 'Kathmandu Grid Tee', 'category' => 'Essentials', 'price' => 1200, 'discount' => 0],
        ['name' => 'Himalayan Runner Jacket', 'category' => 'Outerwear', 'price' => 4500, 'discount' => 5]
    ];

    $stmtProd = $pdo->prepare("INSERT INTO products (name, category, base_price, discount_pct, status, image_url) VALUES (?, ?, ?, ?, 'active', ?)");
    foreach ($products as $i => $p) {
        $stmtProd->execute([$p['name'], $p['category'], $p['price'], $p['discount'], $images[$i]]);
    }

    // Insert 5 Gallery items
    $stmtGal = $pdo->prepare("INSERT INTO gallery (image_url) VALUES (?)");
    foreach ($images as $img) {
        $stmtGal->execute([$img]);
    }

    echo "Database seeded with 5 products and 5 gallery items.";
} catch (Exception $e) {
    echo "Seed Error: " . $e->getMessage();
}
?>
