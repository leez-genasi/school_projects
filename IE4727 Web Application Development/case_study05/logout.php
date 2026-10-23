<?php
    session_start();
    $user = $_SESSION['valid_user'];
    unset($_SESSION['valid_user']);
    session_destroy();
    if (empty($_SESSION['valid_user'])) {
        header("Location: login.php");
    }
?>