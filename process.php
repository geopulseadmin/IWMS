<?php
header("Access-Control-Allow-Origin: *");

// Path to your CSV file
$csvFilePath = 'gis_sample_data.csv';

// Initialize an array to hold the response data
$response = array();

// Attempt to read the CSV file
try {
    // Read the CSV file into an array
    $csvData = array_map('str_getcsv', file($csvFilePath));

    // If successful, add data to the response
    $response['success'] = true;
    $response['data'] = $csvData;
} catch (Exception $e) {
    // If an exception occurs, add error message to the response
    $response['success'] = false;
    $response['error'] = $e->getMessage();
}

// Output the response as JSON
echo json_encode($response);
?>
