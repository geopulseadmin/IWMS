<?php
require('config.php');

header('Content-Type: application/json');

try {
    // Check if an ID is provided
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $geometryType = isset($_GET['geometryType']) ? $_GET['geometryType'] : null;


    if ($id) {
        // Fetch a specific record by ID
        if($geometryType == "LineString" || $geometryType == "MultiLineString" ){
            $sql = "SELECT ST_AsGeoJSON(geom) AS geom FROM \"IWMS_line\" WHERE fid = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id]);
            $record = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($record) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Record retrieved successfully.',
                    'data' => json_decode($record['geom'], true) // Decode the GeoJSON to make it directly usable in the client-side script
                ]);
            } else {
                throw new Exception("No record found with the ID: $id");
            }
        }else if( $geometryType == "Polygon" || $geometryType == "MultiPolygon"){
            $sql = "SELECT ST_AsGeoJSON(geom) AS geom FROM \"Polygon_data\" WHERE fid = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id]);
            $record = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($record) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Record retrieved successfully.',
                    'data' => json_decode($record['geom'], true) // Decode the GeoJSON to make it directly usable in the client-side script
                ]);
            } else {
                throw new Exception("No record found with the ID b: $id");
            }
        }
        else if( $geometryType == "Point"){
            $sql = "SELECT ST_AsGeoJSON(geom) AS geom FROM \"IWMS_point\" WHERE fid = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id]);
            $record = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($record) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Record retrieved successfully.',
                    'data' => json_decode($record['geom'], true) // Decode the GeoJSON to make it directly usable in the client-side script
                ]);
            } else {
                throw new Exception("No record found with the ID b: $id");
            }
        }
       
    } else {
        throw new Exception("ID parameter is missing.");
    }
} catch (Exception $e) {
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
?>
