<?php

//выборка переменных заказов для последующей подстановке при рендере личного кабинета

function prepareCabinet(&$page_vars){
    if(isset($_SESSION['user'])) {
  	$orders = getAssocResult("SELECT id_order, amount, order_status_name as `status`, datetime_create as `date` FROM `order`
 INNER JOIN order_status on`order`.id_order_status = order_status.id_order_status WHERE id_user = " . (int)$_SESSION['user']['id_user']);

    $page_vars["orders"] = $orders;
    }
    else{
        header("Location: /");
    }
}

//данная функция вызывается через AJAX 
//отдает в AJAX html-код детализации заказа 

function getOrderDetails($action) {

    if (isset($_SESSION['user']) && $action = "getdetails" && isset($_POST['id_order'])) {

        $details = getAssocResult("SELECT good_name as `name`, price FROM basket INNER JOIN goods on basket.id_good = goods.id_good WHERE id_order = " . (int)$_POST['id_order']);

        $vars["details"] = $details;

        echo renderPage("details_block", $vars);
    }	
}