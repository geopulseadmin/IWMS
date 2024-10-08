<?php
session_start();
require_once './APIS/config.php'; // Database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Query the database to verify the user credentials
    try {
        $sql = "SELECT * FROM users_login WHERE email = :email";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Credentials are valid
            $_SESSION['loggedin'] = true;
            $_SESSION['user_id'] = $user['user_id']; // Store user ID in session

            $redirectURL = isset($_GET['qrData']) ? 'dashboard.html?qrData=' . urlencode($_GET['qrData']) : 'dashboard.php';
            header('Location: ' . $redirectURL);
            exit;
        } else {
            $_SESSION['login_status'] = 'failed';
            header('Location: login1.php');
            exit;
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>
