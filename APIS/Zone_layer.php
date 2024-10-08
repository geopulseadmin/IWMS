<?php
require('config.php');
header('Content-Type: application/json');

try {
    // Establish a connection to the database (assuming $pdo is defined in config.php)
    if (!isset($pdo)) {
        throw new Exception("PDO connection not found. Please check your configuration.");
    }

    // Prepare the SQL query
    $sql = 'SELECT fid, ST_AsGeoJSON(geom)::json as geom, "Zone", "Zone_Name" FROM public."Zone_layer"';


    // Query to retrieve data from the table
    $stmt = $pdo->query($sql);
    
    // Fetch all data as an associative array
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Output the data as JSON
    echo json_encode($data);
} catch (Exception $e) {
    // Handle any exceptions
    echo json_encode(array('error' => $e->getMessage()));
}
?>
