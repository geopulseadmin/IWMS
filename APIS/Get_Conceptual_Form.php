<?php
require('config.php');

header('Content-Type: application/json');

try {
    // Check if an ID is provided
    $id = isset($_GET['id']) ? $_GET['id'] : null;

    if ($id) {
        // Fetch a specific record by ID
        $sql = "SELECT * FROM conceptual_form WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $record = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($record) {
            echo json_encode([
                'success' => true,
                'message' => 'Record retrieved successfully.',
                'data' => $record
            ]);
        } else {
            throw new Exception("No record found with the ID: $id");
        }
    } else {
        // Fetch all records
        $sql = "SELECT * FROM conceptual_form";
        $stmt = $pdo->query($sql);
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'message' => 'All records retrieved successfully.',
            'data' => $records
        ]);
    }
} catch (Exception $e) {
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
?>
