<?php
require 'config.php';

header('Content-Type: application/json');

try {
    if (!isset($pdo)) {
        throw new Exception("PDO connection not found. Please check your configuration.");
    }

    $rawData = file_get_contents('php://input');
    $formDataArray = json_decode($rawData, true);

    $projectNo = $formDataArray['projectNo'] ?? null;
    $aaWork = $formDataArray['aaWork'] ?? null;
    $workType = $formDataArray['workType'] ?? null;
    $scopeOfWork = $formDataArray['scopeOfWork'] ?? null;
    $projectFinancialYear = $formDataArray['projectFinancialYear'] ?? null;
    $department = $formDataArray['department'] ?? null;
    $d_id = $formDataArray['d_id'] ?? null;
    // $projectType = $formDataArray['projectType'];
    $projectOffice = $formDataArray['projectOffice'] ?? null;
    $juniorName = $formDataArray['juniorName'] ?? null;
    $contactNo = $formDataArray['contactNo'] ?? null;
    $dateIn = $formDataArray['dateIn'] ?? null;
    $zone = $formDataArray['zone'] ?? null;
    $ward = $formDataArray['ward'] ?? null;
    $budgetCode = $formDataArray['budgetCodes'] ?? null;
    $Width = isset($formDataArray['Width']) && $formDataArray['Width'] !== '' ? (int) $formDataArray['Width'] : null;
    $Length = isset($formDataArray['Length']) && $formDataArray['Length'] !== '' ? (int) $formDataArray['Length'] : null;

    $works_aa_approval_id = $formDataArray['Id'] ?? null;
    $createdAt = date('Y-m-d H:i:s');

    $conceptual_no = $formDataArray['conceptual_no'] ?? null;
    $con_appr_date = $formDataArray['con_appr_date'] ?? null;
    $created_date = $formDataArray['created_date'] ?? null;
    $tender_amount = $formDataArray['tender_amount'] ?? null;
    $updated_date = $formDataArray['updated_date'] ?? null;
    $gis_id = $formDataArray['gis_id'] ?? null;
    $no_of_road = $formDataArray['no_of_road'] ?? null;
    $area = $formDataArray['area'] ?? null;
    $measure_in = $formDataArray['measure_in'] ?? null;
    $project_from = $formDataArray['project_from'] ?? null;
    $budget_year = $formDataArray['budget_year'] ?? null;
    $agency = $formDataArray['agency'] ?? null;
    $work_completion_date = $formDataArray['work_completion_date'] ?? null;
    $struct_no = $formDataArray['struct_no'] ?? null;
    $user_id = $formDataArray['user_id'] ?? null;
    $wardId = $formDataArray['wardId'] ?? null;
    $zoneId = $formDataArray['zoneId'] ?? null;
    $departmentId = $formDataArray['departmentId'] ?? null;
    $stage = $formDataArray['stage'] ?? null;
    $entryTime = date('Y-m-d H:i:s');

    $sql = "INSERT INTO conceptual_form (project_no, work_name, work_type, scope_of_work, project_financial_year, department, project_office, junior_engineer_name, contact_no, date_in, zone, ward, width, length, budgetCode, works_approval_id, created_at, conceptual_no, con_appr_date, created_date, tender_amount, updated_date, gis_id, no_of_road, area, measure_in, project_from, budget_year, agency, work_completion_date,struct_no,user_id,ward_id,zone_id,d_id,stage,entry_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?, ?,?,?,?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $projectNo,
        $aaWork,
        $workType,
        $scopeOfWork,
        $projectFinancialYear,
        $department,
        $projectOffice,
        $juniorName,
        $contactNo,
        $dateIn,
        $zone,
        $ward,
        $Width,
        $Length,
        $budgetCode,
        $works_aa_approval_id,
        $createdAt,
        $conceptual_no,
        $con_appr_date,
        $created_date,
        $tender_amount,
        $updated_date,
        $gis_id,
        $no_of_road,
        $area,
        $measure_in,
        $project_from,
        $budget_year,
        $agency,
        $work_completion_date,
        $struct_no,
        $user_id,
        $wardId,
        $zoneId,
        $departmentId,
        $stage,
        $entryTime
    ]);

    $lastInsertId = $pdo->lastInsertId();
    echo json_encode([
        'success' => true,
        'message' => 'Form data saved successfully.',
        'data' => [
            'id' => $lastInsertId,
            'width' => $Width,
            'lenght' => $Length,
            'wardname' => $ward,
            'department' => $department,
        ],
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}
