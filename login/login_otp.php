<?php

// Enable error reporting for debugging (disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Include database connection file
include('../APIS/db.php');

// Retrieve Work_ID from the URL if present
$Work_ID = isset($_GET['Work_ID']) ? $_GET['Work_ID'] : null;
if ($Work_ID) {
    $_SESSION['Work_ID'] = $Work_ID; // Store Work_ID in session
}

// MSG91 credentials
$authKey = "432414AoNngRMmO670be39eP1"; // Replace with your actual MSG91 authkey
$template_id = "670d1079d6fc053e2f6688d2"; // Replace with your actual template_id
$otp_expiry = "1"; // OTP expiry time in minutes (1 minute as per your URL)
$country_code = "+91"; // Country code

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve the contact number from POST data
    $raw_contact_no = trim($_POST['contact_no']);

    // Validate the contact number: must be exactly 10 digits
    if (preg_match('/^[0-9]{10}$/', $raw_contact_no)) {
        // Format the contact number with country code
        $contact_no = $country_code . $raw_contact_no;

        // Check if the contact number is already registered
        try {
            $stmt = $pdo->prepare("SELECT * FROM users_login WHERE contact_no = :contact_no");
            $stmt->bindParam(':contact_no', $raw_contact_no);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                // User found, proceed with sending OTP

                // Construct the MSG91 OTP API URL dynamically
                $url = "https://control.msg91.com/api/v5/otp";
                $params = http_build_query([
                    'otp_expiry'         => $otp_expiry,
                    'template_id'        => $template_id,
                    'mobile'             => $contact_no,
                    'authkey'            => $authKey,
                    'realTimeResponse'   => '1'
                ]);
                $full_url = "$url?$params";

                // Initialize cURL
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $full_url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

                // Execute the cURL request
                $response = curl_exec($ch);

                // Check for cURL errors
                if ($response === false) {
                    $error = curl_error($ch);
                    curl_close($ch);
                    echo "cURL Error: $error";
                    exit();
                }

                // Log the full response for debugging
                file_put_contents('msg91_response.log', date('Y-m-d H:i:s') . " - API Response: " . $response . "\n", FILE_APPEND);

                // Close the cURL session
                curl_close($ch);

                // Decode the JSON response from MSG91
                $responseData = json_decode($response, true);

                // Check if the response indicates success
                if (isset($responseData['type']) && strtolower($responseData['type']) === 'success') {
                    // Use a placeholder OTP for testing (if msg91 isn't providing one)
                    echo "<script>console.log('Generated OTP: " . $responseData['otp'] . "');</script>";
                    // Redirect the user to the OTP verification page with Work_ID
                    header("Location: verify_otp.php?contact_no=" . urlencode($contact_no) . "&Work_ID=" . urlencode($_SESSION['Work_ID'] ?? ''));
                    exit();
                } else {
                    // Handle failure response from MSG91
                    $error_message = isset($responseData['message']) ? $responseData['message'] : 'Unknown error';
                    echo "Failed to send OTP. Response: " . htmlspecialchars($error_message);
                }

            } else {
                // User not found, redirect to registration page
                echo "<script>
                    alert('This contact number is not registered. Please register first.');
                    window.location.href = 'register.php?Work_ID=" . urlencode($Work_ID) . "';
                </script>";
            }
        } catch (PDOException $e) {
            // Handle database errors
            echo "Database Error: " . htmlspecialchars($e->getMessage());
        }

    } else {
        // Invalid contact number format
        echo "Invalid contact number! Please enter a 10-digit mobile number.";
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login with OTP</title>
    <link rel="stylesheet" href="login_otp.css">
</head>
<body>

    <div class="container">
        <div class="form-container">
            <h2>Verify your phone number</h2>
            <p>We will send you a <strong>One Time Password (OTP)</strong> on this mobile number</p>

            <form method="POST" action="">
                <div class="input-group">
                    <input type="text" id="country_code" value="+91" disabled>
                    <input type="text" id="contact_no" name="contact_no" placeholder="Enter mobile no." required pattern="\d{10}" title="Enter a 10-digit mobile number">
                </div>
                <button type="submit">Get OTP</button>
            </form>

            <div class="register-button-container">
                Don't have an account?
                <a href="register.php?Work_ID=<?php echo htmlspecialchars($_SESSION['Work_ID'] ?? ''); ?>" class="register-button">Create an account</a>
            </div>
        </div>
    </div>

</body>
</html>
