<?php
require 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$fid = isset($data['fid']) ? (int) $data['fid'] : 0;

$geometryType = isset($data['geometryType']) ? $data['geometryType'] : "LineString";

try {
    // Prepare the update statement to nullify geometry based on geometry type
    if ($geometryType == "LineString" || $geometryType == "MultiLineString") {
        $stmtUpdate = $pdo->prepare("UPDATE \"IWMS_line\" SET geom = NULL WHERE fid = :fid");
    } elseif ($geometryType == "Polygon" || $geometryType == "MultiPolygon") {
        $stmtUpdate = $pdo->prepare("UPDATE \"Polygon_data\" SET geom = NULL WHERE fid = :fid");
    } elseif ($geometryType == "Point") {
        $stmtUpdate = $pdo->prepare("UPDATE \"IWMS_point\" SET geom = NULL WHERE fid = :fid");
    } else {
        echo json_encode(["error" => "Unsupported geometry type"]);
        exit;
    }

    // Bind the fid parameter
    $stmtUpdate->bindParam(':fid', $fid, PDO::PARAM_INT);

    // Execute the update statement
    $stmtUpdate->execute();

    // Update the conceptual_form table with the current date and time
    $currentDateTime = date('Y-m-d H:i:s');
    $configId = isset($data['configId']) ? $data['configId'] : 0;

    $stmtUpdateConceptual = $pdo->prepare("UPDATE conceptual_form SET \"updatedAt\" = :currentDateTime WHERE id = :id");
    $stmtUpdateConceptual->bindParam(':currentDateTime', $currentDateTime, PDO::PARAM_STR);
    $stmtUpdateConceptual->bindParam(':id', $configId, PDO::PARAM_INT);
    $stmtUpdateConceptual->execute();

    echo json_encode(["message" => "Geometry successfully nullified", "fid" => $fid]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
    exit;
}
?>
