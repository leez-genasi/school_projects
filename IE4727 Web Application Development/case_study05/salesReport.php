<?php 
    session_start();
    include "dbconnect.php";
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
            <section class='main'>
                <h2>Sales Report</h2>
                <div class='sales-report'>
                    <table>
                        <tr>
                            <td align="right"><b>Total Sales:</b></td>
                            <td>
                                <?php
                                    $totalsales = $dbcnx->query(
                                        "SELECT total FROM sales"
                                    );
                                    $total = 0;
                                    foreach ($totalsales as $indiv) {
                                        foreach ($indiv as $x) {
                                            $total+=number_format($x, 2);
                                        }
                                    }
                                    echo "$" .number_format($total, 2);
                                ?>
                            </td>
                        </tr>
                        <tr>
                            <td align="right"><b>Today's Sales:</b></td>
                            <td>
                                <?php
                                    $todaysales = $dbcnx->query(
                                        "SELECT total FROM sales WHERE timestamp >= CURDATE();"
                                    );
                                    $todaytotal = 0;
                                    foreach ($todaysales as $indiv) {
                                        foreach ($indiv as $x) {
                                            $todaytotal+=number_format($x, 2);
                                        }
                                    }
                                    echo "$" .number_format($todaytotal, 2);
                                
                                ?>
                            </td>
                        </tr>
                    </table>
                    <h4>Sales Breakdown</h4>
                    <table>
                        <thead><tr>
                            <th align='right'>Product</th>
                            <th>Total Quantity</th>
                            <th>Total Product Sales</th>
                        </tr></thead>
                        <tbody>
                            <?php 
                                $sales = $dbcnx->query(
                                    "SELECT p.name, s.qty, s.shot, s.total
                                    FROM productprice p 
                                    INNER JOIN sales s
                                    ON p.product_id = s.product_id
                                    GROUP BY p.name, s.shot;"
                                );
                                
                                foreach ($sales as $item) {
                                    echo "<tr>";
                                    echo "<td align='right'>" .$item['name'];
                                    if (isset($item['shot'])) {
                                        echo " (" .$item['shot'] .")";
                                    } else {
                                        echo "</td>";
                                    }
                                    echo "<td align='center'>" .$item['qty'] ."</td>";
                                    echo "<td align='center'>$" .number_format($item['total'], 2) ."</td></tr>";
                                }
                                $dbcnx -> close();
                            ?>
                        </tbody>
                    </table>
                </div>
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