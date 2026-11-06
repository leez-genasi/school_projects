<?php
    $servername = "localhost";
    $user = "root";
    $password = "";
    $database = "ie4727casestudy";
    @$dbcnx = new mysqli($servername, $user, $password, $database);
    if ($dbcnx->connect_error) {
        echo "Database is not online";
        exit;
    }
?>