<?php
require 'config.php';

header('Content-Type: application/json');


$data = json_decode(file_get_contents('php://input'), true);

$proj_id = isset($data['proj_id']) ? (int) $data['proj_id'] : null;
$ra = isset($data['ra']) ? (int) $data['ra'] : null;
$category = isset($data['category']) ? (string) $data['category'] : null;
$photo = isset($data['photo']) ? (string) $data['photo'] : null;
$selectedGeometry = isset($data['geom']) ?  $data['geom'] : null;

if (is_null($proj_id)) {
    echo json_encode(["error" => "Missing required field: proj_id"]);
    exit;
}

if (is_null($ra)) {
    echo json_encode(["error" => "Missing required field: ra"]);
    exit;
}

if (is_null($category)) {
    echo json_encode(["error" => "Missing required field: category"]);
    exit;
}

if (is_null($photo)) {
    echo json_encode(["error" => "Missing required field: photo"]);
    exit;
}

if (is_null($selectedGeometry)) {
    echo json_encode(["error" => "Missing required field: geom"]);
    exit;
}
try {

    $stmtInsertData = $pdo->prepare("INSERT INTO geotagphoto ( proj_id, ra, category, photo, geom) VALUES ( :proj_id, :ra, :category, :photo, ST_GeomFromText(:geom, 4326))");
    $stmtInsertData->bindParam(':proj_id', $proj_id, PDO::PARAM_STR);
    $stmtInsertData->bindParam(':ra', $ra, PDO::PARAM_STR);
    $stmtInsertData->bindParam(':category', $category, PDO::PARAM_STR);
    $stmtInsertData->bindParam(':photo', $photo, PDO::PARAM_STR);
    $stmtInsertData->bindParam(':geom', $selectedGeometry, PDO::PARAM_EVT_ALLOC);


    $stmtInsertData->execute();

    echo json_encode([
        'success' => true,
        'message' => 'Geometry Save Successfully'
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
    exit;
}
?>
