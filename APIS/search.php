<?php
require('config.php');

header('Content-Type: application/json');

try {
    // Check if the 'column' parameter is set in the GET request
    if(isset($_GET['column'])) {
        $columnName = $_GET['column'];
        
        // Call the fetchDataFromIWMSPoint function to get data based on the column name
        $data = fetchDataFromIWMSPoint($columnName, $pdo);

        // Return the data as JSON
        echo json_encode(['data' => $data]);
    } else {
        echo json_encode(['error' => 'Column parameter is not set']);
    }
} catch (Exception $e) {
    // Handle any exceptions
    echo json_encode(['error' => $e->getMessage()]);
}

function fetchDataFromIWMSPoint($columnName, $pdo) {
    // Use prepared statements to avoid SQL injection
    $query = "SELECT DISTINCT \"$columnName\" FROM \"IWMS_line\"";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_COLUMN);
    return $data;
}
?>
