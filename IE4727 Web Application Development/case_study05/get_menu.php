<?php
    include "dbconnect.php";
    $result = $dbcnx->query(
        "SELECT * FROM productprice"
    );
    $menu = $result -> fetch_all(MYSQLI_ASSOC);
    $result -> free();
    $dbcnx->close();

    echo json_encode($menu);
?>