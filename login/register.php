
<?php
session_start();
require_once '../APIS/db.php'; // Database connection

// Retrieve Work_ID from the session or query string
$workID = $_SESSION['Work_ID'] ?? $_GET['work_id'] ?? '';
?><!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>pmc</title>
    <link rel="icon" href="../png/pmcjpeg.png" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="register.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <script>
        function validateEmail() {
            const email = document.querySelector('input[name="email"]').value;
            const messageElement = document.getElementById('emailError');

            if (!email.endsWith('.com')) {
                messageElement.textContent = 'Email must end with .com';
                return false;
            }

            messageElement.textContent = '';
            return true;
        }
    </script>
</head>

<body>
    <div class="container">
        <div class="right-section">
            <div class="login-container">
                <!-- <a href="index.html">
                    <i class="fa-solid fa-house icon-top-10"></i>
                </a> -->
                <h2>Register</h2>
                <form class="login-form" action="register_process.php" method="post" onsubmit="return validateEmail()">
                    <h2 class="login-title"><img src="" class="logo" alt="" style=""></h2>
                    <div class="form-control">
                        <i class="fas fa-user icon"></i>
                        <input type="text" name="username" placeholder="UserName" required>
                    </div>
                    <div class="form-control">
                        <i class="fas fa-envelope icon"></i>
                        <input type="email" name="email" placeholder="Email" required>
                        <span id="emailError" style="color: red;"></span>
                    </div>
                    <div class="form-control">
                        <i class="fas fa-lock icon"></i>
                        <input type="password" name="password" placeholder="Password" id="password" required>
                    </div>
                    <!-- Occupation field is commented out -->
                    <div class="form-control">
                        <i class="fa-solid fa-phone icon"></i>
                        <input type="tel" name="contact_no" placeholder="Contact Number" required>
                    </div>
                    <button type="submit" value="Register">Register</button>
                    <p class="endline">
                        <a href="login.php?work_id=<?php echo htmlspecialchars($workID); ?>" class="btn">I am already a member</a>
                    </p>
                </form>

            </div>
        </div>
    </div>
</body>
</html>