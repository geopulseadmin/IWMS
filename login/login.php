<?php
session_start();
require_once '../APIS/db.php'; // Database connection

// Check if work_id is present in the query string and store it in the session
if (isset($_GET['work_id'])) {
    $_SESSION['Work_ID'] = $_GET['work_id'];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? ''; // Change to username
    $password = $_POST['password'] ?? '';
    $workID = $_SESSION['Work_ID'] ?? ''; // Retrieve Work_ID from the session

    if (empty($username) || empty($password)) {
        $_SESSION['login_status'] = 'failed';
        header('Location: login.php');
        exit;
    }

    try {
        $sql = "SELECT * FROM users_login WHERE username = :username"; // Query by username
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['loggedin'] = true;
            $_SESSION['user_id'] = $user['user_id']; // Store user ID in session
            $_SESSION['username'] = $user['username'];
            // Prepare to update the users table with login_time and work_id
            $loginTime = date('Y-m-d H:i:s'); // Get the current time

            $updateSql = "INSERT INTO users (user_id, username, login_time, work_id) 
                          VALUES (:user_id, :username, :login_time, :work_id)
                          ON CONFLICT (user_id) DO UPDATE 
                          SET login_time = EXCLUDED.login_time, work_id = EXCLUDED.work_id, username = EXCLUDED.username";

            $updateStmt = $pdo->prepare($updateSql);
            $updateStmt->bindParam(':user_id', $user['user_id']);
            $updateStmt->bindParam(':username', $user['username']);
            $updateStmt->bindParam(':login_time', $loginTime);
            $updateStmt->bindParam(':work_id', $workID);
            $updateStmt->execute();

            // Redirect to geometry page with Work_ID if available
            if (!empty($workID)) {
           
                // $redirectURL = "https://iwmsgis.pmc.gov.in/gis/iwms/geometry_page.php?Work_ID={$workID}";

                 $redirectURL = "http://localhost/PMC/IWMS/IWMS_test/geometry_page.php?Work_ID={$workID}";
                // $redirectURL = "http://localhost/IWMS_test2/geometry_page.php?Work_ID={$workID}";
                header('Location: ' . $redirectURL);
                exit;
            } else {
                header('Location: geometry_page.php');
                exit;
            }
        } else {
            $_SESSION['login_status'] = 'failed';
            header('Location: login.php');
            exit;
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PMC Login</title>
    <link rel="stylesheet" href="login.css">
    <link rel="icon" href="../png/pmcjpeg.png" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

<body>
    <div class="container">
        <h2>Login</h2>
        <form action="login.php" method="post">
            <div class="input-container">
                <i class="fa fa-user icon"></i> <!-- Change icon to user -->
                <input type="text" name="username" placeholder="Username" required> <!-- Change input field to username -->
            </div>
            <div class="input-container">
                <i class="fa fa-lock icon"></i>
                <input type="password" name="password" placeholder="Password" required>
            </div>
            <button type="submit">Login</button>
        </form>
        <?php
        if (isset($_SESSION['login_status']) && $_SESSION['login_status'] == 'failed') {
            echo '<p style="color: red;">Invalid username or password. Please try again.</p>';
            unset($_SESSION['login_status']);
        }
        ?>

        <!-- Register Button -->
        <div class="register-button-container">
            <a href="register.php?work_id=<?php echo htmlspecialchars($_SESSION['Work_ID'] ?? ''); ?>" class="register-button">Create an account </a>
        </div>
    </div>
</body>

</html>
