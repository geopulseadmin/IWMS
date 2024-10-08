<?php
require('config.php');
header('Content-Type: application/json');

try {
    // Establish a connection to the database (assuming $pdo is defined in config.php)
    if (!isset($pdo)) {
        throw new Exception("PDO connection not found. Please check your configuration.");
    }

    // Prepare the SQL query with placeholders
    $sql = 'SELECT "OBJECTID", ST_AsGeoJSON(geom)::json as geom, "Road_type", "Road_name", "Label", oneway, "Length", "Bridge1", "Shape_Length"
            FROM public."Exist_Road"
            WHERE "Road_name" != :emptyString AND "Road_name" != :whitespace';

    // Prepare the statement
    $stmt = $pdo->prepare($sql);

    // Bind parameters
    $stmt->bindParam(':emptyString', $emptyString, PDO::PARAM_STR);
    $stmt->bindParam(':whitespace', $whitespace, PDO::PARAM_STR);

    // Set parameter values
    $emptyString = '';
    $whitespace = ' ';

    // Execute the statement
    $stmt->execute();

    // Fetch all data as an associative array
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Output the data as JSON
    echo json_encode($data);
} catch (Exception $e) {
    // Handle any exceptions
    echo json_encode(array('error' => $e->getMessage()));
}
?>
