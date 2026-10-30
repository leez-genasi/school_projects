<?php
    include "dbconnect.php";
    $menu = $dbcnx->query(
        "SELECT * FROM productprice"
    );
    $dbcnx->close();
?>
<html lang="en">
    <head>
        <link rel="stylesheet" href="stylesheet.css">
        <script src="menuUpdate.js" defer></script>
    </head>
    <body>
        <div id="wrapper">
            <div class="header"; width=" 100%">
                <h1>JavaJam Coffee House</h1>   
            </div>
            <div class="content">
                <div class="nav">
                    <p>
                        <a href="index.html">Home</a><br>
                        <a href="menu.php">Menu</a><br>
                        <a href="music.html">Music</a><br>
                        <a href="jobs.html">Jobs</a>
                    </p>
                </div>
                <div class="main">
                    <h2>Coffee at JavaJam</h2>
                    <div class="menu">
                    <table id="menu">
                        <tr>
                            <th>Menu Item</th>
                            <th>Menu Desc</th>
                            <th>Qty.</th>
                            <th>Subtotal</th>
                        </tr>
                        <?php 
                            foreach ($menu as $row) {
                                echo "<tr class='menu-item' data-id='" .$row['product_id'] ."'>";
                                echo "<td class='menu-name'><h3>" .$row['name'] ."</h3></td>";
                                echo "<td class='menu-desc'>" .$row['description'] ."<br>";
                                if ($row['single_shot'] && $row['double_shot']) {
                                    echo "<b><form><input type='radio' name='menuShot' value='single'>Single $" .number_format($row['single_price'], 2) ."<input type='radio' name='menuShot' value='double'>Double $" .number_format($row['double_price'], 2) ."</form></b></td>";
                                }
                                else {
                                    echo "<b>Endless Cup $" .number_format($row['price'], 2) ."</b></td>";
                                }

                                echo "<td><input type='text' class='menuQty' size='3' maxlength='3'></td>";
                                echo "<td class='menuPrice'></td>";
                                echo "</tr>";
                            }
                        ?>
                        <tr>
                            <td colspan="2" align="right"><b>Total Price:</b></td>
                            <td id="totalPrice" colspan="2"></td>
                        </tr>
                        <tr><td colspan='4' align='right'><button type="button" id="checkoutBtn">Check Out</ button></td></tr>
                    </table>
                    </div>
            </div>
            </div>
            <div class="footer">
                <i>
                    <p>Copyright &copy; 2024 JavaJam Coffee House<br>
                    <a href="mailto:leec0160@e.ntu.edu.sg">charlette@lee.com</a></p>
                </i>
            </div>
        </div>
    </body>
</html>
