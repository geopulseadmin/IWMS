<?php
header('Content-Type: application/json');
$api_url = 'http://pmciwms.in/api/all-project-data'; // Replace this with your API endpoint URL
$id = 848; // Replace 848 with the works_aa_approval_id of the record you want to fetch

// Create a new cURL resource
$curl = curl_init();

// Set the cURL options
curl_setopt($curl, CURLOPT_URL, $api_url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

// Execute the cURL request
$response = curl_exec($curl);

// Close cURL resource
curl_close($curl);

// Process the response
$data = json_decode($response, true);

// Check if data is fetched successfully
if ($data && isset($data['status']) && $data['status'] == 200 && isset($data['data']['projectData'])) {
    // Filter the projectData array to include only the record where works_aa_approval_id is 848
    $filteredData = array_filter($data['data']['projectData'], function ($project) use ($id) {
        return isset($project['project']['works_aa_approval_id']) && $project['project']['works_aa_approval_id'] == $id;
    });

    // Convert the filtered data to a list for consistency with single record response
    $filteredDataList = array_values($filteredData);

    // Check if data is found
    if (!empty($filteredDataList)) {
        // Data fetched successfully, return the filtered data
        echo json_encode($filteredDataList[0]); // Return the first item in the filtered array
    } else {
        // Data not found for the given works_aa_approval_id
        echo json_encode(['error' => 'Data not found for works_aa_approval_id = ' . $id]);
    }
} else {
    // Failed to fetch data or status is not 200
    echo json_encode(['error' => 'Failed to fetch data.']);
}
?>