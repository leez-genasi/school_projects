
<?php
    include "dbconnect.php";
    header("Content-type: application/json");
    $input = json_decode(file_get_contents("php://input"), true);
    if (empty($input['price'])) {
        echo json_encode(["success" => false, "error" => "No changes input."]);
        exit;
    }

    try {
        foreach($input['price'] as $menuItem) {
            $id = (int)$menuItem['id'];
            $singlePrice = $menuItem['singlePrice'];
            $doublePrice = $menuItem['doublePrice'];
            $menuPrice = $menuItem['menuPrice'];

            $ins = $dbcnx -> prepare(
                "UPDATE productprice SET
                single_price = ?,
                double_price = ?,
                price = ?
                WHERE product_id = ?"
            );

            $ins -> bind_param("dddi", $singlePrice, $doublePrice, $menuPrice, $id);
            $ins -> execute();
        }
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e -> getMessage()]);
    }
?>