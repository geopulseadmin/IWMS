<?php
require('config.php');

header('Content-Type: application/json');

try {
    // Check if works_approval_id is provided
    $worksApprovalId = isset($_GET['works_approval_id']) ? $_GET['works_approval_id'] : null;

    if ($worksApprovalId) {
        // Fetch the latest record by works_approval_id
        $sql = "SELECT * FROM conceptual_form WHERE works_approval_id = ? ORDER BY id DESC LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$worksApprovalId]);
        $record = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($record) {
            echo json_encode([
                'success' => true,
                'message' => 'Latest record retrieved successfully.',
                'data' => $record
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => "No records found with the works_approval_id: $worksApprovalId"
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'works_approval_id not provided.'
        ]);
    }
} catch (Exception $e) {
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
?>
