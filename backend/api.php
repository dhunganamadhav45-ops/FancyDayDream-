<?php
// backend/api.php
header('Content-Type: application/json');
require_once 'config.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'get_products':
        $stmt = $pdo->query("SELECT * FROM products ORDER BY id DESC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'add_product':
        try {
            $name = $_POST['name'] ?? '';
            $category = $_POST['category'] ?? '';
            $price = $_POST['price'] ?? 0;
            $discount = $_POST['discount'] ?? 0;
            $status = $_POST['status'] ?? 'active';
            
            // Randomly assign one of our existing high-quality images (1-6.jpg)
            $randomId = rand(1, 6);
            $image = 'assets/img/' . $randomId . '.jpg'; 

            $sql = "INSERT INTO products (name, category, base_price, discount_pct, status, image_url) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$name, $category, $price, $discount, $status, $image]);
            
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'delete_product':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    case 'get_settings':
        $stmt = $pdo->query("SELECT * FROM homepage_settings WHERE id = 1");
        echo json_encode($stmt->fetch());
        break;

    case 'update_settings':
        try {
            $title = $_POST['hero_title'] ?? '';
            $subtitle = $_POST['hero_subtitle'] ?? '';
            $badge = $_POST['hero_badge'] ?? '';
            $slide1 = $_POST['slide1_url'] ?? '';
            $slide2 = $_POST['slide2_url'] ?? '';
            $slide3 = $_POST['slide3_url'] ?? '';

            $sql = "UPDATE homepage_settings SET hero_title=?, hero_subtitle=?, hero_badge=?, slide1_url=?, slide2_url=?, slide3_url=? WHERE id=1";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$title, $subtitle, $badge, $slide1, $slide2, $slide3]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'get_gallery':
        $stmt = $pdo->query("SELECT * FROM gallery ORDER BY id DESC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'add_gallery':
        try {
            $randomId = rand(1, 6);
            $image = 'assets/img/' . $randomId . '.jpg'; 
            $stmt = $pdo->prepare("INSERT INTO gallery (image_url) VALUES (?)");
            $stmt->execute([$image]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'delete_gallery':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM gallery WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    case 'register_user':
        try {
            $name = $_POST['full_name'] ?? '';
            $email = $_POST['email'] ?? '';
            $phone = $_POST['phone'] ?? '';
            $address = $_POST['address'] ?? '';
            $password = password_hash($_POST['password'] ?? '', PASSWORD_DEFAULT);

            $stmt = $pdo->prepare("INSERT INTO users (full_name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$name, $email, $phone, $address, $password]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'save_order':
        try {
            $name = $_POST['customer_name'] ?? '';
            $email = $_POST['email'] ?? '';
            $phone = $_POST['phone'] ?? '';
            $city = $_POST['city'] ?? '';
            $items = $_POST['items'] ?? ''; // JSON string
            $total = $_POST['total_price'] ?? 0;

            $stmt = $pdo->prepare("INSERT INTO orders (customer_name, email, phone, city, items, total_price) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $email, $phone, $city, $items, $total]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'get_orders':
        $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'get_users':
        $stmt = $pdo->query("SELECT * FROM users ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'update_order_status':
        try {
            $id = $_POST['id'];
            $status = $_POST['status'];
            $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
            $stmt->execute([$status, $id]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}
?>
