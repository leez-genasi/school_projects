<?php 
    session_start();
    include "dbconnect.php";

    if (!isset($_SESSION['valid_user'])) {
        header("Location: login.php");
    }

    $menu = $dbcnx->query(
        "SELECT * FROM productprice"
    );
    $dbcnx->close();
?>

<html>
    <head>
        <link rel="stylesheet" href="stylesheet.css">
        <script src="updatePrice.js" defer></script>
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
                    <a href="logout.php">Log Out</a>
                </p>
            </div>
            <section class='main'><h2>Update Menu Price</h2>
                    <table class='menu'>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Single Shot Price</th>
                                <th>Double Shot Price</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <?php 
                            foreach ($menu as $row) {
                                echo "<tr class='menu-item' data-id='" .$row['product_id'] ."'>";
                                echo "<td class='menu-name' align='right'>" .$row['name'];
                                if ($row['single_shot'] == 1) {
                                    echo "<td align='center'><input type='text' class='singlePrice' size='3' maxlength='3' value=" .$row['single_price'] ."></td>";    
                                } else {
                                    echo "<td align='center'>--</td>";
                                }
                                if ($row['double_shot'] == 1) {
                                    echo "<td align='center'><input type='text' class='doublePrice' size='3' maxlength='3' value=" .$row['double_price'] ."></td>";    
                                } else {
                                    echo "<td align='center'>--</td>";
                                } 
                                if (isset($row['price'])) {
                                    echo "<td align='center'><input type='text' class='menuPrice' size='3' maxlength='3' value=" .$row['price'] ."></td>";
                                } else {
                                    echo "<td align='center'>--</td>";
                                }
                                echo "</tr>";
                            }
                        ?>
                        <tr>
                            <td colspan='3' align='right'><button type='submit' id='resetPrice'>Reset</button></td>
                            <td colspan='2' align='right'><button type='submit' id='updatePrice'>Update Prices</button></td>
                        </tr>
                    </table>
                </section>
        </div>
        <div class="footer">
            <i>
                <p>Copyright &copy; 2024 JavaJam Coffee House<br>
                <a href="mailto:leec0160@e.ntu.edu.sg">charlette@lee.com</a></p>
            </i>
        </div>
    </body>
</html>