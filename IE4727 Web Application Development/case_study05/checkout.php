<?php
    include "dbconnect.php";
    header("Content-type: application/json");

    $input = json_decode(file_get_contents("php://input"), true);
    if (empty($input['order'])) {
        echo json_encode(["success" => false, "error" => "no items"]);
        exit;
    }

    try { 
            foreach($input['order'] as $order) {
            $id = (int)$order['id'];
            $shot = $order['shot'];
            $qty = $order['qty'];
            $price = $order['price'];

            $ins = $dbcnx -> prepare(
                "INSERT INTO sales (product_id, shot, qty, total) VALUES (?, ?, ?, ?)"
            );

            $ins -> bind_param("isid", $id, $shot, $qty, $price);
            $ins -> execute();
        }
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e -> getMessage()]);
        
    }


?>