<?php
// $host = 'iwmsgis.pmc.gov.in';
// $dbname = 'pmc';
// $username = 'postgres';
// $password = 'pmc992101';

$host = 'iwmsgis.pmc.gov.in';
$dbname = 'Test';
$username = 'postgres';
$password = 'pmc992101';

try {
    // Establish a connection to the database
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $username, $password);
    
    // Set PDO to throw exceptions on error
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // echo "Connected successfully!";
} catch (PDOException $e) {
    // Handle connection errors
    echo "Connection failed: " . $e->getMessage();
}
?>
