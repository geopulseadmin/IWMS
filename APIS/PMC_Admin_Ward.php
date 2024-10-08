<?php
require('config.php');
header('Content-Type: application/json');

try {
    // Establish a connection to the database (assuming $pdo is defined in config.php)
    if (!isset($pdo)) {
        throw new Exception("PDO connection not found. Please check your configuration.");
    }

      // Initialize variables for selected zones
      $selectedZones = isset($_GET['selectedZones']) ? $_GET['selectedZones'] : '';

    // Query to retrieve all data from the table
    $sql = 'SELECT fid, ST_AsGeoJSON(geom)::json as geom, "OBJECTID_1", "OBJECTID", "Ward_NO", "Ward_Name", "Text", "Zone", "Shape_Leng", "Area", "Shape_Length", "Shape_Area", "Ward_Office" FROM public."PMC_Admin_Ward"';
    
      // Add WHERE clause to filter by selected zones, if provided
      if (!empty($selectedZones)) {
        // Convert the selected zone IDs to an array
        $zoneIDs = explode(',', $selectedZones);

        // Sanitize and quote each zone ID
        $quotedZoneIDs = array_map(function($zoneID) use ($pdo) {
            return $pdo->quote($zoneID);
        }, $zoneIDs);

        // Implode the quoted zone IDs with commas
        $quotedZoneIDsString = implode(',', $quotedZoneIDs);

        // Add the WHERE clause to the SQL query
        $sql .= ' WHERE "Zone" IN (' . $quotedZoneIDsString . ')';
    }

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
