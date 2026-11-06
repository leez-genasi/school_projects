<?php 
    session_start();
    if (!isset($_SESSION['valid_user'])) {
        header("Location: login.php");
    }
?>

<html>
    <head>
        <link rel="stylesheet" href="stylesheet.css">
    </head>
    <body id="wrapper">
        <div class="header"; width=" 100%">
            <h1>JavaJam Coffee House</h1>   
        </div>
        <div class="content">
            <div class="nav">
                <p>
                    <a href="updatePrice.php">Update Price</a><br>
                    <a href="salesReport.php">Sales Report</a><br>
                </p>
            </div>
            <section class='main'><h2>Admin Page</h2></section>
        </div>
        <div class="footer">
            <i>
                <p>Copyright &copy; 2024 JavaJam Coffee House<br>
                <a href="mailto:leec0160@e.ntu.edu.sg">charlette@lee.com</a></p>
            </i>
        </div>
    </body>
</html>