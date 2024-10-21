<?php
// Include the database connection file
require_once '../APIS/db.php';

// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Encrypt password
    $contact_no = $_POST['contact_no'];

    try {
        // Prepare an SQL statement to insert the data
        $sql = "INSERT INTO users_login (username, email, password, contact_no) 
                VALUES (:username, :email, :password, :contact_no)";

        $stmt = $pdo->prepare($sql);

        // Bind parameters to the query
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':contact_no', $contact_no);

        // Execute the query
        if ($stmt->execute()) {
            $workID = htmlspecialchars($_SESSION['Work_ID'] ?? ''); // Get Work_ID safely for the URL
            echo "<script>
                alert('Registration successful!');
                window.location.href = 'login_otp.php?work_id=" . $workID . "';
            </script>";
        } else {
            $workID = htmlspecialchars($_SESSION['Work_ID'] ?? ''); // Handle the Work_ID for failed cases too
            echo "<script>
                alert('Registration failed. Please try again.');
                window.location.href = 'register.php?work_id=" . $workID . "';
            </script>";
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>
