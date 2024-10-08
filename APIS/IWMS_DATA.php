<?php
require('config.php');
header('Content-Type: application/json');

try {
    if (!isset($pdo)) {
        throw new Exception("PDO connection not found. Please check your configuration.");
    }

    // Initialize variables to hold the selected department and work type
    $selected_departments = isset($_GET['departments']) ? $_GET['departments'] : [];
    $selected_work_type = isset($_GET['work_type']) ? $_GET['work_type'] : [];
    $selected_zones = isset($_GET['zone']) ? $_GET['zone'] : [];
    $selected_wards = isset($_GET['ward']) ? $_GET['ward'] : [];
    $selected_project_fi = isset($_GET['project_fi']) ? $_GET['project_fi'] : [];
    $selected_stage = isset($_GET['stage']) ? $_GET['stage'] : [];

// Construct the WHERE clause based on selected filters
$where_clause = 'WHERE zone IS NOT NULL AND ward IS NOT NULL';
if (!empty($selected_departments)) {
    $departments_condition = implode("', '", $selected_departments);
    $where_clause .= " AND departme_1 IN ('$departments_condition')";
}
if ($selected_work_type) {
    $work_type_condition = implode("', '", $selected_work_type);
    $where_clause .= " AND work_type IN ('$work_type_condition')";
}

if (!empty($selected_zones)) {
    $zone_condition = implode("', '", $selected_zones);
    $where_clause .= " AND zone IN ('$zone_condition')";
}
if (!empty($selected_wards)) {
    $ward_condition = implode("', '", $selected_wards);
    $where_clause .= " AND ward IN ('$ward_condition')";
}
if (!empty($selected_project_fi)) {
    $project_fi_condition = implode("', '", $selected_project_fi);
    $where_clause .= " AND project_fi IN ('$project_fi_condition')";
}
if (!empty($selected_stage)) {
    $stage_condition = implode("', '", $selected_stage);
    $where_clause .= " AND stage IN ('$stage_condition')";
}



    $stmt_line = $pdo->prepare("SELECT 
    id, ST_AsGeoJSON(geom)::json as geom,  works_aa_a, name_of_wo, scope_of_w, work_type, conceptual, conc_appr_, created_at, je_name, contact_no, tender_amo, project_fi, update_dat, gis_id, zone_id, zone, ward_id, ward, department, departme_1, stage, no_of_road, length, width, area, measure_in, village
    FROM public.\"IWMS_line\"
    $where_clause");
    $stmt_line->execute();
    $data_line = $stmt_line->fetchAll(PDO::FETCH_ASSOC);

    // Fetch data from IWMS_point table
    $stmt_point = $pdo->prepare("SELECT 
           id, ST_AsGeoJSON(geom)::json as geom, works_aa_a, name_of_wo, scope_of_w, work_type, conceptual, conc_appr_, created_at, je_name, contact_no, tender_amo, project_fi, update_dat, gis_id, zone_id, zone, ward_id, ward, department, departme_1, stage, no_of_road, length, width, area, measure_in, village
        FROM public.\"IWMS_point\"
        $where_clause");
    $stmt_point->execute();
    $data_point = $stmt_point->fetchAll(PDO::FETCH_ASSOC);

    // Fetch data from IWMS_polygon table
    $stmt_polygon = $pdo->prepare("SELECT 
           id, ST_AsGeoJSON(geom)::json as geom, works_aa_a, name_of_wo, scope_of_w, work_type, conceptual, conc_appr_, created_at, je_name, contact_no, tender_amo, project_fi, update_dat, gis_id, zone_id, zone, ward_id, ward, department, departme_1, stage, no_of_road, length, width, area, measure_in, village
        FROM public.\"Polygon_data\"
        $where_clause");
    $stmt_polygon->execute();
    $data_polygon = $stmt_polygon->fetchAll(PDO::FETCH_ASSOC);

    // Merge data from all tables into a single array
    $data = array_merge($data_line, $data_point, $data_polygon);

    // Extract unique department names and work types from filtered data
    $unique_departments = array_values(array_unique(array_column($data, 'departme_1')));
    $unique_work_types = array_values(array_unique(array_column($data, 'work_type')));
    $unique_zones = array_values(array_unique(array_column($data, 'zone')));
    $unique_wards = array_values(array_unique(array_column($data, 'ward')));
    $unique_project_fi = array_values(array_unique(array_column($data, 'project_fi')));
    $unique_stage = array_values(array_unique(array_column($data, 'stage')));

    // Final API response structure
    $api_response = [
        'department_names' => $unique_departments,
        'work_types' => $unique_work_types,
        'zones' => $unique_zones,
        'wards' => $unique_wards,
        'project_fi' => $unique_project_fi,
        'stage' => $unique_stage,
        'projects_data' => $data
    ];

    // Output the data as JSON
    echo json_encode($api_response);
} catch (Exception $e) {
    // Handle any exceptions
    echo json_encode(array('error' => $e->getMessage()));
}
?>
