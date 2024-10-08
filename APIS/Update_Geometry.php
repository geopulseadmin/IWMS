<?php
require 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);




$fid = isset($data['fid']) ? (int) $data['fid'] : 0;

$selectCoordinatesData = $data['selectCoordinatesData'];
$roadLength = isset($data['roadLength']) && $data['roadLength'] !== "" ? $data['roadLength'] : null;
$bufferWidth = isset($data['bufferWidth']) && $data['bufferWidth'] !== "" ? $data['bufferWidth'] : null;
$geometryType = isset($data['geometryType']) ? $data['geometryType'] : "LineString";

$selectedGeometry = null;
if (!empty($selectCoordinatesData)) {
    $lastElement = end($selectCoordinatesData);
    $selectedGeometry = isset($lastElement['geometry']) ? $lastElement['geometry'] : null;
}

if ($selectedGeometry === null &&( $geometryType == "LineString" || $geometryType == "MultiLineString")) {
    $selectedGeometry = isset($selectCoordinatesData[1]['geometry']) ? $selectCoordinatesData[1]['geometry'] : (isset($selectCoordinatesData[0]['geometry']) ? $selectCoordinatesData[0]['geometry'] : null);
}
else if ($selectedGeometry === null &&( $geometryType == "Polygon" || $geometryType == "MultiPolygon")){
    $selectedGeometry = isset($selectCoordinatesData['geometry']) ? $selectCoordinatesData['geometry'] : (isset($selectCoordinatesData['geometry']) ? $selectCoordinatesData['geometry'] : null); 
}
else if ($selectedGeometry === null && $geometryType == "Point" ) {
    $selectedGeometry = isset($selectCoordinatesData[1]['geometry']) ? $selectCoordinatesData[1]['geometry'] : (isset($selectCoordinatesData[0]['geometry']) ? $selectCoordinatesData[0]['geometry'] : null);
}


$selectedGeometryJson = json_encode($selectedGeometry);
$area = isset($data['area']) ? $data['area'] : 0;
$geometryType = isset($data['geometryType']) ? $data['geometryType'] : "LineString";


try {
    if ($geometryType == "LineString" || $geometryType == "MultiLineString") {
        $stmtUpdate = $pdo->prepare("UPDATE \"IWMS_line\" SET geom = ST_Force3D(ST_GeomFromGeoJSON(:geometry)) WHERE fid = :fid");
    } elseif ($geometryType == "Polygon" || $geometryType == "MultiPolygon") {
        $stmtUpdate = $pdo->prepare("UPDATE \"Polygon_data\" SET geom = ST_Force3D(ST_GeomFromGeoJSON(:geometry)) WHERE fid = :fid");
    } elseif ($geometryType == "Point") {
        $stmtUpdate = $pdo->prepare("UPDATE \"IWMS_point\" SET geom = ST_Force3D(ST_GeomFromGeoJSON(:geometry)) WHERE fid = :fid");
    } else {
        echo json_encode(["error" => "Unsupported geometry type"]);
        exit;
    }

    $stmtUpdate->bindParam(':geometry', $selectedGeometryJson, PDO::PARAM_STR);
    $stmtUpdate->bindParam(':fid', $fid, PDO::PARAM_INT);
    $stmtUpdate->execute();

    $stmtUpdateConceptual = $pdo->prepare("UPDATE conceptual_form SET \"updatedAt\" = :currentDateTime WHERE id = :id");
    $stmtUpdateConceptual->bindParam(':currentDateTime', $currentDateTime, PDO::PARAM_STR);
    $stmtUpdateConceptual->bindParam(':id', $configId, PDO::PARAM_INT);
    $stmtUpdateConceptual->execute();

    echo json_encode(["message" => "Geometry successfully updated", "fid" => $fid]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
    exit;
}
?>
