<?php
mysqli_report(MYSQLI_REPORT_OFF);

$dbHost = 'localhost';
$dbUser = 'root';
$dbPass = '';
$dbName = 'theatre';
$db = new mysqli($dbHost, $dbUser, $dbPass);

if ($db->connect_errno) {
    http_response_code(500);
    exit('Could not connect to MySQL. Start MySQL in XAMPP and check the password in php/database.php. XAMPP uses a blank root password by default.');
}

if (!$db->select_db($dbName)) {
    http_response_code(500);
    if ($db->errno === 1049) {
        exit('The theatre database has not been created yet. Open http://localhost/phpmyadmin/, choose Import, select this project\'s sql/schema.sql file, and click Go. Then refresh this page.');
    }
    exit('Could not open the theatre database. Check that sql/schema.sql was imported.');
}

$db->set_charset('utf8mb4');
