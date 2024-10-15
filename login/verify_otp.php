<?php
// Ensure Work_ID is available in session or URL
$Work_ID = $_SESSION['Work_ID'] ?? $_GET['Work_ID'] ?? null;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $contact_no = trim($_POST['contact_no']);
    $otp = trim($_POST['otp']);

    // OTP verification process
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => "https://control.msg91.com/api/v5/otp/verify?otp=$otp&mobile=$contact_no",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "authkey:432414AoNngRMmO670be39eP1"
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);

    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
        $responseData = json_decode($response, true);

        // If OTP is verified successfully
        if (isset($responseData['type']) && strtolower($responseData['type']) === 'success') {
            // Redirect to geometry_page.php with Work_ID
            if ($Work_ID) {
                header("Location: ../geometry_page.php?Work_ID=" . urlencode($Work_ID));
                exit;
            } else {
                echo "No work ID found.";
            }
        } else {
            // Handle OTP verification failure
            if (isset($responseData['message'])) {
                echo "Error: " . $responseData['message'];
            } else {
                echo "OTP verification failed. Please try again.";
            }
        }
    }
} else {
    // If GET request, show OTP form and retrieve the contact number from URL
    if (isset($_GET['contact_no'])) {
        $contact_no = urldecode($_GET['contact_no']);
        // echo "Enter the OTP sent to +$contact_no";
    } else {
        // echo "No OTP request found for this mobile number.";
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <link rel="stylesheet" href="verify_otp.css">
    <style>
        * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background-color: #F5F5F5;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.container {
    width: 100%;
    max-width: 400px;
    padding: 20px;
    background-color: #FFFFFF;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
}

h2 {
    font-size: 24px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 20px;
}

p {
    margin: 10px 0;
    font-size: 14px;
    color: #666666;
}

.otp-timer {
    font-size: 16px;
    color: #FF5722; /* Attention-grabbing color for the timer */
    margin: 10px 0;
}

input[type="text"] {
    width: 100%;
    height: 48px;
    font-size: 18px;
    text-align: center;
    border-radius: 5px;
    border: 1px solid #CCCCCC;
    background-color: #FAFAFA;
    margin-top: 10px; /* Space between the heading and input */
}

input[type="text"]:focus {
    border-color: #4CAF50;
    outline: none;
}

button {
    width: 100%;
    padding: 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #45a049; /* Darker green on hover */
}

#resend-link {
    margin-top: 20px;
    font-size: 14px;
    color: #666666;
}

#resend-link a {
    color: #4CAF50;
    text-decoration: none;
}

#resend-link a:hover {
    text-decoration: underline;
}

#time {
    font-weight: bold; /* Make the timer more prominent */
    color: #FF5722; /* Match the timer color */
}

    </style>
    <script>
        // JavaScript function to handle the countdown timer
        function startTimer(duration, display) {
            var timer = duration, minutes, seconds;
            var interval = setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.textContent = minutes + ":" + seconds;

                if (--timer < 0) {
                    clearInterval(interval);
                    document.getElementById("submit-btn").disabled = true;
                    document.getElementById("resend-link").style.display = "block";
                }
            }, 1000);
        }

        window.onload = function () {
            var timerDuration = 60 * 1; // 1 minute countdown
            var display = document.querySelector('#time');
            startTimer(timerDuration, display);
        };
    </script>
</head>
<body>

    <div class="container">
        <div class="form-container">
            <h2>Enter the OTP sent to <?php echo htmlspecialchars($contact_no); ?></h2>

            <form method="POST" action="">
                <input type="hidden" name="contact_no" value="<?php echo htmlspecialchars($contact_no); ?>">
                <input type="text" name="otp" placeholder="Enter OTP" required pattern="\d{4}" title="Enter the 4-digit OTP">
                <button type="submit" id="submit-btn">Verify OTP</button>
            </form>

            <div id="resend-link" style="display:none;">
                <p>Didn't receive the OTP? <a href="resend_otp.php?contact_no=<?php echo urlencode($contact_no); ?>">Resend OTP</a></p>
            </div>

            <p>OTP will expire in <span id="time">01:00</span> minutes!</p>
        </div>
    </div>

</body>
</html>
