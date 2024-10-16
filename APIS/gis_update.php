<?php
require 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['geoJSON'])) {
    echo json_encode(["error" => "GeoJSON data not provided"]);
    exit;
}
$configId = isset($data['gis_id']) ? (int) $data['gis_id'] : 0;
$department = isset($data['department']) ? $data['department'] : null;
$isWardSelection = isset($data['isWardSelection']) ? $data['isWardSelection'] : false;

$sqlGet = "SELECT * FROM conceptual_form WHERE id = :id";
$stmtGet = $pdo->prepare($sqlGet);
$stmtGet->bindParam(':id', $configId, PDO::PARAM_INT);
$stmtGet->execute();
$configData = $stmtGet->fetch(PDO::FETCH_ASSOC);

if (!$configData) {
    echo json_encode(["error" => "No data found for the provided configId"]);
    exit;
}

date_default_timezone_set('Asia/Kolkata');
$currentDateTime = date('Y-m-d H:i:s');


if ($isWardSelection){
    
    $selectCoordinatesData = $data['selectCoordinatesData'];
    $selectedGeometry = $selectCoordinatesData['geometry'];
    $selectedGeometryJson = json_encode($selectedGeometry);

    $area =  isset($data['area']) ? $data['area'] : 0;
   

    $stmtIWMS = $pdo->prepare("INSERT INTO \"GIS_Ward_Layer\" (


        geom, je_name, name_of_wo, project_fi, scope_of_w, ward, work_type, zone, contact_no, length, width,
        conceptual, conc_appr_, created_at, tender_amo, update_dat, gis_id, no_of_road, area, measure_in, \"Project_Office_Id\",\"Project_Office\",
        \"Budget_Year\",\"Agency\", \"Work_Comletion_Date\",departme_1,\"Budget_Code\",works_aa_a ,department,stage,zone_id,ward_id
    ) VALUES (
        ST_Force3D(ST_GeomFromGeoJSON(:geometry)), :je_name, :name_of_wo, :project_fi, :scope_of_w, :ward, :work_type, :zone, :contact_no, :length, :width,
        :conceptual, :conc_appr_, :created_at, :tender_amo, :update_dat, :gis_id, :no_of_road, :area, :measure_in, :Project_Office_Id, :Project_Office,
        :Budget_Year, :Agency, :Work_Completion_Date , :departme_1,:Budget_Code,:works_aa_a ,:department,:stage,:zone_id,:ward_id
    )");

    $stmtIWMS->bindParam(':geometry', $selectedGeometryJson, PDO::PARAM_STR);
    $stmtIWMS->bindParam(':je_name', $configData['junior_engineer_name'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':name_of_wo', $configData['work_name'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':project_fi', $configData['project_financial_year'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':scope_of_w', $configData['scope_of_work'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':ward', $configData['ward'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':work_type', $configData['work_type'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':zone', $configData['zone'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':contact_no', $configData['contact_no'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':length', $configData['length'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':width', $configData['width'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':conceptual', $configData['conceptual_no'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':conc_appr_', $configData['con_appr_date'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':created_at', $configData['created_date'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':tender_amo', $configData['tender_amount'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':update_dat', $configData['updated_date'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':gis_id', $configData['gis_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':no_of_road', $configData['no_of_road'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':area', $configData['area'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':measure_in', $configData['measure_in'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Project_Office_Id', $configData['project_from'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Project_Office', $configData['project_office'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Budget_Year', $configData['budget_year'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Agency', $configData['agency'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Work_Completion_Date', $configData['work_completion_date'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':departme_1', $configData['department'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Budget_Code', $configData['budgetcode'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':works_aa_a', $configData['works_approval_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':department', $configData['d_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':stage', $configData['stage'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':zone_id', $configData['zone_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':ward_id', $configData['ward_id'], PDO::PARAM_STR);
    
    try {
        $stmtIWMS->execute();
        $lastInsertIdIWMS = $pdo->lastInsertId();
        $stmtUpdate = $pdo->prepare("UPDATE conceptual_form SET area = :area, \"updatedAt\" = :exitTime , exit_time = :currentDateTime   WHERE id = :id");
        $stmtUpdate->bindParam(':area', $area, PDO::PARAM_STR);
        $stmtUpdate->bindParam(':currentDateTime', $currentDateTime, PDO::PARAM_STR);
        $stmtUpdate->bindParam(':exitTime', $currentDateTime, PDO::PARAM_STR);
        $stmtUpdate->bindParam(':id', $configId, PDO::PARAM_INT);
      
        $stmtUpdate->execute();
        echo json_encode(["message" => "Data successfully saved to both tables"]);
    } catch (PDOException $e) {
      
        echo json_encode(["error" => $e->getMessage()]);
        exit;
    }

    return ;
}



    $selectCoordinatesData = $data['selectCoordinatesData'];
    $roadLength = isset($data['roadLength']) && $data['roadLength'] !== "" ? $data['roadLength'] : null;
    $bufferWidth = isset($data['bufferWidth']) && $data['bufferWidth'] !== "" ? $data['bufferWidth'] : null;

    $selectedGeometry = null;
    if (!empty($selectCoordinatesData)) {
        $lastElement = end($selectCoordinatesData);
        $selectedGeometry = isset($lastElement['geometry']) ? $lastElement['geometry'] : null;
    }
    $geometryType = isset($data['geometryType']) ? $data['geometryType'] : "LineString" ;
    
    $selectedGeometry = isset($selectCoordinatesData['geometry']) ? $selectCoordinatesData['geometry'] : (isset($selectCoordinatesData['geometry']) ? $selectCoordinatesData['geometry'] : null); 

    $selectedGeometryJson = json_encode($selectedGeometry);
    $area =  isset($data['area']) ? $data['area'] : 0;
   
 
   // return ;

   if($geometryType == "LineString" || $geometryType == "MultiLineString"){
    $stmtIWMS = $pdo->prepare("INSERT INTO \"IWMS_line\" (
        geom, je_name, name_of_wo, project_fi, scope_of_w, ward, work_type, zone, contact_no, length, width,
        conceptual, conc_appr_, created_at, tender_amo, update_dat, gis_id, no_of_road, measure_in, \"Project_Office_Id\",\"Project_Office\",
        \"Budget_Year\",\"Agency\", \"Work_Comletion_Date\",departme_1,\"Budget_Code\",works_aa_a,length_1,department,stage,zone_id,ward_id
    ) VALUES (
        ST_Force3D(ST_GeomFromGeoJSON(:geometry)), :je_name, :name_of_wo, :project_fi, :scope_of_w, :ward, :work_type, :zone, :contact_no, :length, :width,
        :conceptual, :conc_appr_, :created_at, :tender_amo, :update_dat, :gis_id, :no_of_road, :measure_in, :Project_Office_Id, :Project_Office,
        :Budget_Year, :Agency, :Work_Completion_Date , :departme_1,:Budget_Code,:works_aa_a,:length_1,:department,:stage,:zone_id,:ward_id
    )");
    
    $stmtIWMS->bindParam(':geometry', $selectedGeometryJson, PDO::PARAM_STR);
    // $stmtIWMS->bindParam(':department', $configData['department'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':je_name', $configData['junior_engineer_name'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':name_of_wo', $configData['work_name'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':project_fi', $configData['project_financial_year'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':scope_of_w', $configData['scope_of_work'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':ward', $configData['ward'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':work_type', $configData['work_type'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':zone', $configData['zone'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':contact_no', $configData['contact_no'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':length', $configData['length'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':width', $configData['width'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':conceptual', $configData['conceptual_no'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':conc_appr_', $configData['con_appr_date'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':created_at', $configData['created_date'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':tender_amo', $configData['tender_amount'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':update_dat', $configData['updated_date'], PDO::PARAM_STR);  
    $stmtIWMS->bindParam(':gis_id', $configData['gis_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':no_of_road', $configData['no_of_road'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':measure_in', $configData['measure_in'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Project_Office_Id', $configData['project_from'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Budget_Year', $configData['budget_year'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Agency', $configData['agency'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Work_Completion_Date', $configData['work_completion_date'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':departme_1', $configData['department'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Budget_Code', $configData['budgetcode'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':works_aa_a', $configData['works_approval_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':length_1', $lenght, PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Project_Office', $configData['project_office'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':department', $configData['d_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':stage', $configData['stage'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':zone_id', $configData['zone_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':ward_id', $configData['ward_id'], PDO::PARAM_STR);
    
    try {
        $stmtIWMS->execute();
        $lastInsertIdIWMS = $pdo->lastInsertId();
        $stmtUpdate = $pdo->prepare("UPDATE conceptual_form SET area = :area, \"updatedAt\" = :exitTime , exit_time = :currentDateTime   WHERE id = :id");
        $stmtUpdate->bindParam(':area', $area, PDO::PARAM_STR);
        $stmtUpdate->bindParam(':currentDateTime', $currentDateTime, PDO::PARAM_STR);
        $stmtUpdate->bindParam(':exitTime', $currentDateTime, PDO::PARAM_STR);
        $stmtUpdate->bindParam(':id', $configId, PDO::PARAM_INT);
      
        $stmtUpdate->execute();
        echo json_encode(["message" => "Data successfully saved to both tables"]);
    } catch (PDOException $e) {
      
        echo json_encode(["error" => $e->getMessage()]);
        exit;
    }
    
   }
   else if ($geometryType == "Polygon" || $geometryType == "MultiPolygon" ){
  

    $stmtIWMS = $pdo->prepare("INSERT INTO \"Polygon_data\" (


    geom, je_name, name_of_wo, project_fi, scope_of_w, ward, work_type, zone, contact_no, length, width,
    conceptual, conc_appr_, created_at, tender_amo, update_dat, gis_id, no_of_road, area, measure_in, \"Project_Office_Id\",\"Project_Office\",
    \"Budget_Year\",\"Agency\", \"Work_Comletion_Date\",departme_1,\"Budget_Code\",works_aa_a,department,stage,zone_id,ward_id
) VALUES (
    ST_Force3D(ST_GeomFromGeoJSON(:geometry)), :je_name, :name_of_wo, :project_fi, :scope_of_w, :ward, :work_type, :zone, :contact_no, :length, :width,
    :conceptual, :conc_appr_, :created_at, :tender_amo, :update_dat, :gis_id, :no_of_road, :area, :measure_in, :Project_Office_Id, :Project_Office,
    :Budget_Year, :Agency, :Work_Completion_Date , :departme_1,:Budget_Code,:works_aa_a,:department,:stage,:zone_id,:ward_id
)");


    $stmtIWMS->bindParam(':geometry', $selectedGeometryJson, PDO::PARAM_STR);
    // $stmtIWMS->bindParam(':department', $configData['department'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':je_name', $configData['junior_engineer_name'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':name_of_wo', $configData['work_name'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':project_fi', $configData['project_financial_year'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':scope_of_w', $configData['scope_of_work'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':ward', $configData['ward'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':work_type', $configData['work_type'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':zone', $configData['zone'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':contact_no', $configData['contact_no'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':length', $configData['length'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':width', $configData['width'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':conceptual', $configData['conceptual_no'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':conc_appr_', $configData['con_appr_date'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':created_at', $configData['created_date'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':tender_amo', $configData['tender_amount'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':update_dat', $configData['updated_date'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':gis_id', $configData['gis_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':no_of_road', $configData['no_of_road'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':area', $configData['area'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':measure_in', $configData['measure_in'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Project_Office_Id', $configData['project_from'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Budget_Year', $configData['budget_year'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Agency', $configData['agency'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Work_Completion_Date', $configData['work_completion_date'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':departme_1', $configData['department'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Budget_Code', $configData['budgetcode'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':works_aa_a', $configData['works_approval_id'], PDO::PARAM_STR);
     $stmtIWMS->bindParam(':Project_Office', $configData['project_office'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':department', $configData['d_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':stage', $configData['stage'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':zone_id', $configData['zone_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':ward_id', $configData['ward_id'], PDO::PARAM_STR);
    





    try {
        $stmtIWMS->execute();
        $lastInsertIdIWMS = $pdo->lastInsertId();
        $stmtUpdate = $pdo->prepare("UPDATE conceptual_form SET area = :area, \"updatedAt\" = :exitTime , exit_time = :currentDateTime   WHERE id = :id");
        $stmtUpdate->bindParam(':area', $area, PDO::PARAM_STR);
        $stmtUpdate->bindParam(':currentDateTime', $currentDateTime, PDO::PARAM_STR);
        $stmtUpdate->bindParam(':exitTime', $currentDateTime, PDO::PARAM_STR);
        $stmtUpdate->bindParam(':id', $configId, PDO::PARAM_INT);
      
        $stmtUpdate->execute();
        echo json_encode(["message" => "Data successfully saved to both tables"]);
    } catch (PDOException $e) {
      
        echo json_encode(["error" => $e->getMessage()]);
        exit;
    }
   }
   else if ($geometryType == "Point"){

    $stmtIWMS = $pdo->prepare("INSERT INTO \"IWMS_point\" (


    geom, je_name, name_of_wo, project_fi, scope_of_w, ward, work_type, zone, contact_no, length, width,
    conceptual, conc_appr_, created_at, tender_amo, update_dat, gis_id, no_of_road, area, measure_in, \"Project_Office_Id\",\"Project_Office\",
    \"Budget_Year\",\"Agency\" ,departme_1,\"Budget_Code\",works_aa_a , department,stage,zone_id,ward_id
) VALUES (
    ST_Force3D(ST_GeomFromGeoJSON(:geometry)), :je_name, :name_of_wo, :project_fi, :scope_of_w, :ward, :work_type, :zone, :contact_no, :length, :width,
    :conceptual, :conc_appr_, :created_at, :tender_amo, :update_dat, :gis_id, :no_of_road, :area, :measure_in, :Project_Office_Id, :Project_Office,
    :Budget_Year, :Agency, :departme_1,:Budget_Code,:works_aa_a , :department,:stage,:zone_id,:ward_id
)");
    //test commit

    $stmtIWMS->bindParam(':geometry', $selectedGeometryJson, PDO::PARAM_STR);
    // $stmtIWMS->bindParam(':department', $configData['department'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':je_name', $configData['junior_engineer_name'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':name_of_wo', $configData['work_name'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':project_fi', $configData['project_financial_year'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':scope_of_w', $configData['scope_of_work'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':ward', $configData['ward'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':work_type', $configData['work_type'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':zone', $configData['zone'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':contact_no', $configData['contact_no'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':length', $configData['length'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':width', $configData['width'], PDO::PARAM_STR);

    $stmtIWMS->bindParam(':conceptual', $configData['conceptual_no'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':conc_appr_', $configData['con_appr_date'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':created_at', $configData['created_date'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':tender_amo', $configData['tender_amount'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':update_dat', $configData['updated_date'], PDO::PARAM_STR);


    $stmtIWMS->bindParam(':gis_id', $configData['gis_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':no_of_road', $configData['no_of_road'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':area', $configData['area'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':measure_in', $configData['measure_in'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Project_Office_Id', $configData['project_from'], PDO::PARAM_STR);



    $stmtIWMS->bindParam(':Budget_Year', $configData['budget_year'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Agency', $configData['agency'], PDO::PARAM_STR);
    
    $stmtIWMS->bindParam(':departme_1', $configData['department'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Budget_Code', $configData['budgetcode'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':works_aa_a', $configData['works_approval_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':Project_Office', $configData['project_office'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':department', $configData['d_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':stage', $configData['stage'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':zone_id', $configData['zone_id'], PDO::PARAM_STR);
    $stmtIWMS->bindParam(':ward_id', $configData['ward_id'], PDO::PARAM_STR);
    







    try {
        $stmtIWMS->execute();
        $lastInsertIdIWMS = $pdo->lastInsertId();
        $stmtUpdate = $pdo->prepare("UPDATE conceptual_form SET area = :area, \"updatedAt\" = :exitTime , exit_time = :currentDateTime   WHERE id = :id");
        $stmtUpdate->bindParam(':area', $area, PDO::PARAM_STR);
        $stmtUpdate->bindParam(':currentDateTime', $currentDateTime, PDO::PARAM_STR);
        $stmtUpdate->bindParam(':exitTime', $currentDateTime, PDO::PARAM_STR);
        $stmtUpdate->bindParam(':id', $configId, PDO::PARAM_INT);
      
        $stmtUpdate->execute();
        echo json_encode(["message" => "Data successfully saved to both tables"]);
    } catch (PDOException $e) {
      
        echo json_encode(["error" => $e->getMessage()]);
        exit;
    }
   }


?>