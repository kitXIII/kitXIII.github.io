<?php

//функция выбирает товары из корзины пользователя, подсчитывает сумму
//фиксирует заказ и связывает товары из корзины и сформированный заказ
//возвращает true/false -результат операции

function operateOrder() { 
    $result = false; 
    if(isset($_SESSION['user'])) {
        $amount = (float)getRowResult("SELECT SUM(price) as amount 
                                        FROM basket 
                                        WHERE id_user = ". (int)$_SESSION['user']['id_user'] . " 
                                        AND is_in_order = 0 ")['amount'];

        if ($amount > 0) {
            $sql = "INSERT INTO `order` (id_user, amount, datetime_create, id_order_status) VALUES (" 
            . (int)$_SESSION['user']['id_user'] . "," . $amount . ",'" . date("Y-m-d H:i:s") ."', 1)";

            $db = getConnection();
            if (mysqli_query($db, $sql)) {
                $order_id = mysqli_insert_id($db);
                $sql = "UPDATE basket SET is_in_order = 1, id_order = " . $order_id . "
                        WHERE id_user = ". (int)$_SESSION['user']['id_user'] . " 
                        AND is_in_order = 0";
                if(mysqli_query($db, $sql)){
                    $result = true;
                } 
            }
            mysqli_close($db);
        }        
    }
    return $result; 
}

function prepareOrderPage(&$page_vars) {
    $sql = "SELECT id_order, user_name as user, amount, order_status_name as `status`, datetime_create as `date`, `order`.id_order_status FROM `order`
        INNER JOIN order_status on `order`.id_order_status = order_status.id_order_status
        INNER JOIN user on `order`.id_user = user.id_user
        order by id_order_status, user";
     
    $orders = getAssocResult($sql);
     
    $page_vars["orders"] = $orders; 
}

function doActionWithOrders($action) {
    $response = [
        "result" => 0,
    ];

    switch($action){
        case "changeStatus":
            changeOrderStatus($response);
            break;
        case "remove":
            removeOrder($response);
            break;
    }

    return json_encode($response);
}

function changeOrderStatus(&$response){
    $response['result'] = 0;
    $db_link = getConnection();
    $id_order = (int)$_POST['id'];
    $order_status_name = mysqli_real_escape_string($db_link, (string)htmlspecialchars(strip_tags($_POST['order'])));
    $sql = "SELECT id_order_status FROM order_status WHERE order_status_name = '" . $order_status_name . "'";
    
    $res = getRowResult($sql, $db_link);
    if ($res) {
        $id_order_status = (int)$res[id_order_status];
    
        $sql = "UPDATE `order` SET `id_order_status` = '" .  $id_order_status . "' WHERE `id_order` = '" . $id_order . "'";
        $db_link = getConnection();
        $res = executeQuery($sql, $db_link);

        if(!$res)
            $response['result'] = 0;
        else
            $response['result'] = 1;
    } 
    
    return $response;   
}

function removeOrder(&$response){
    $response['result'] = 0;
    $db_link = getConnection();
    $id_order = (int)$_POST['id_order']; 
    $sql = "UPDATE basket SET is_in_order = 0 WHERE id_order = '" . $id_order . "'";
    $res = executeQuery($sql, $db_link);
    if ($res) {
        $db_link = getConnection();
        $sql = "DELETE FROM `order` WHERE id_order = '" . $id_order . "'";
        $res = executeQuery($sql, $db_link);
        if(!$res)
            $response['result'] = 0;
        else
            $response['result'] = 1;
    }

    return $response;  
}