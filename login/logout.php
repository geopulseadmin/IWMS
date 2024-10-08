<?php
session_start();
require_once '../APIS/db.php'; // Database connection

if (isset($_SESSION['user_id'])) {
    $logoutTime = date('Y-m-d H:i:s'); // Get the current time

    // Update the logout time in the users table
    $updateSql = "UPDATE users SET logout_time = :logout_time WHERE user_id = :user_id";
    $updateStmt = $pdo->prepare($updateSql);
    $updateStmt->bindParam(':logout_time', $logoutTime);
    $updateStmt->bindParam(':user_id', $_SESSION['user_id']);
    $updateStmt->execute();

    // Clear the session
    session_destroy();

    // Redirect to login page
    header('Location:../dashboard.html');
    exit;
}
?>
