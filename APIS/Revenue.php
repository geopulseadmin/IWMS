<?php
require('config.php');
header('Content-Type: application/json');

try {
    // Establish a connection to the database (assuming $pdo is defined in config.php)
    if (!isset($pdo)) {
        throw new Exception("PDO connection not found. Please check your configuration.");
    }

    // Query to retrieve data from the table
    $stmt = $pdo->query('SELECT fid, "OBJECTID", "SHAPE_Length", "SHAPE_Area", "Gut_No", "Area", "Sector_No", "TPS_Name", "Taluka", "PMC_Limit", "Village_Name" FROM public."Revenue"');
    
    // Fetch all data as an associative array
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Output the data as JSON
    echo json_encode($data);
} catch (Exception $e) {
    // Handle any exceptions
    echo json_encode(array('error' => $e->getMessage()));
}
?>
