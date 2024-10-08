<?php
require 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

// Extract works_aa_approval_id from JSON input
$worksAaApprovalId = $data['works_aa_approval_id'] ?? null;

if (empty($worksAaApprovalId)) {
    echo json_encode(["error" => "No works_aa_approval_id provided"]);
    exit;
}

if (!is_int($worksAaApprovalId)) {
    if (ctype_digit($worksAaApprovalId)) {
        $worksAaApprovalId = (int) $worksAaApprovalId;
    } else {
        echo json_encode(["error" => "Invalid works_aa_approval_id provided"]);
        exit;
    }
}

// Map 'project_id' to 'Pid'
$configId = $data['project_id'] ?? null;
if (!empty($configId)) {
    $data['Pid'] = $configId;
}

function buildUpdateSQL($table, $data) {
    // Exclude 'works_aa_approval_id' from fields to update
    $fields = [];
    foreach ($data as $key => $value) {
        if ($key !== 'works_aa_approval_id') {
            $fields[] = "\"$key\" = :$key";
        }
    }
    // $fields[] = "\"Project_Time\" = NOW()";
    $fields[] = "\"Project_Time\" = timezone('IST', NOW())";

    $fields = implode(', ', $fields); // Join fields with commas for SQL syntax
    return "UPDATE \"$table\" SET $fields WHERE works_aa_a = :works_aa_approval_id"; // Use works_aa_approval_id in WHERE clause
}

function buildInsertSQL($table, $data) {
    // Exclude 'works_aa_approval_id' from fields to insert
    $filteredData = array_filter($data, function($key) {
        return $key !== 'works_aa_approval_id';
    }, ARRAY_FILTER_USE_KEY);
    
    $fields = implode(', ', array_map(fn($key) => "\"$key\"", array_keys($filteredData)));
    $placeholders = implode(', ', array_map(fn($key) => ":$key", array_keys($filteredData)));
    return "INSERT INTO \"$table\" ($fields) VALUES ($placeholders)";
}


$fieldsToUpdate = [
    'tender_amo',
    'Budget_Year',
    'Agency',
    'Budget_Code',
    'Status',
    'Pid',
];

$updateData = array_filter(
    $data,
    function ($key) use ($fieldsToUpdate) {
        return in_array($key, $fieldsToUpdate);
    },
    ARRAY_FILTER_USE_KEY
);

if (empty($updateData)) {
    echo json_encode(["error" => "No valid fields provided for update"]);
    exit;
}

try {
    $pdo->beginTransaction();

    $tables = ["IWMS_line", "Polygon_data", "IWMS_point","GIS_Ward_Layer", "check"];
    foreach ($tables as $table) {
        if ($table === "check") {
            $updateData['time'] = date('Y-m-d H:i:sO');

            $insertSQL = buildInsertSQL($table, $updateData);
            $stmtInsert = $pdo->prepare($insertSQL);
            foreach ($updateData as $key => $value) {
                $stmtInsert->bindValue(":$key", $value);
            }
            $stmtInsert->execute();
        } else {
            unset($updateData['time']);
            $updateSQL = buildUpdateSQL($table, $updateData);
            $stmtUpdate = $pdo->prepare($updateSQL);
            foreach ($updateData as $key => $value) {
                if ($key !== 'works_aa_approval_id') { // Ensure works_aa_approval_id is not bound here
                    $stmtUpdate->bindValue(":$key", $value);
                }
            }
            $stmtUpdate->bindValue(':works_aa_approval_id', $worksAaApprovalId, PDO::PARAM_INT);
            $stmtUpdate->execute();
        }
    }

    $pdo->commit();

    echo json_encode([
        'status' => true,
        'message' => 'Data updated successfully.',
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
?>
