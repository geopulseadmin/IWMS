<?php
require('config.php');
header('Content-Type: application/json');

try {
    // Establish a connection to the database (assuming $pdo is defined in config.php)
    if (!isset($pdo)) {
        throw new Exception("PDO connection not found. Please check your configuration.");
    }

    // Query to retrieve data from the table
    $stmt = $pdo->query('SELECT fid, "OBJECTID_1", "OBJECTID", "SEC_NO", "Shape_Leng", "Village_Na", "Decision", "Broad_LU", "Area", "Shape_Length", "Shape_Area" FROM public."PMC_Reservation"');
    
    // Fetch all data as an associative array
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Output the data as JSON
    echo json_encode($data);
} catch (Exception $e) {
    // Handle any exceptions
    echo json_encode(array('error' => $e->getMessage()));
}
?>
