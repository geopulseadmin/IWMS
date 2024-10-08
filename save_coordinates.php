<?php
$servername = "iwmsgis.pmc.gov.in";
$username = "postgres";
$password = "pmc992101";
$dbname = "Test";

// Create connection
$conn = pg_connect("host=$servername dbname=$dbname user=$username password=$password");

// Check connection
if (!$conn) {
    die("Connection failed: " . pg_last_error());
}




// Retrieve POST data
$lat = $_POST['lat'];
$lng = $_POST['lng'];
$open_time = $_POST['open_time'];
$close_time = $_POST['close_time'];
$duration = $_POST['duration'];
$radius = $_POST['radius'];

// Get the user's IP address
$ip_address = $_SERVER['REMOTE_ADDR'];

// Convert timestamps to appropriate format
$open_time = date('Y-m-d H:i:s', $open_time / 1000);
$close_time = date('Y-m-d H:i:s', $close_time / 1000);

// Prepare the SQL query
$sql = "INSERT INTO livecoordinates (location, open_time, close_time, duration, radius, ip_address) VALUES (ST_SetSRID(ST_MakePoint($1, $2), 4326), $3, $4, $5, $6, $7)";
$result = pg_query_params($conn, $sql, array($lng, $lat, $open_time, $close_time, $duration, $radius, $ip_address));

if ($result) {
    echo "Data saved successfully";
} else {
    echo "Error: " . pg_last_error($conn);
}

pg_close($conn);

?>
