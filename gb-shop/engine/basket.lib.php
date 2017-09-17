<?php
/**
 * Блок корзины в шапке
 * @return mixed|null|string
 */
function prepareBasketBlock(){
    $basket_block = "";

    if(isset($_SESSION['user'])){
        $basket_vars = [
            "goods" => 0,
            "amount" => 0
        ];

        $basket_data = getRowResult("SELECT COUNT(id_basket) AS goods, SUM(price) as amount 
                                        FROM basket 
                                        WHERE id_user = ".(int)$_SESSION['user']['id_user']." 
                                        AND is_in_order = 0 ");

        if(isset($basket_data['goods'])){
            $basket_vars['goods'] = $basket_data['goods'];
            $basket_vars['amount'] = $basket_data['amount'];
        }

        $basket_block = renderPage("basket_block", $basket_vars);
    }

    return $basket_block;
}

/**
 * страница корзины
 */
function prepareBasketPage(&$page_vars){
    $page_vars["amount"] = 0;
    $page_vars["basket_content"] = [];

    if(isset($_SESSION['user'])){
        $basket_sum = getRowResult("SELECT SUM(price) as amount 
                                        FROM basket 
                                        WHERE id_user = ".(int)$_SESSION['user']['id_user']." 
                                        AND is_in_order = 0 ");

        $page_vars["amount"] = $basket_sum["amount"];


        $basket_data = getAssocResult("SELECT b.id_basket, b.id_good, b.price, g.good_name, g.good_price
                                        FROM basket b
                                        LEFT JOIN goods g USING(id_good)
                                        WHERE id_user = ".(int)$_SESSION['user']['id_user']." 
                                        AND is_in_order = 0 ");

        $page_vars["basket_content"] = $basket_data;
    }
    else{
        header("Location: /");
    }
}

function doActionWithBasket($action){
    $response = [
        "result" => 0,
    ];

    switch($action){
        case "add":
            addProductToBasket($response);
            break;
        case "remove":
            removeProductFromBasket($response);
            break;
    }

    return json_encode($response);
}

function addProductToBasket(&$response){
    $id_good = (int)$_POST['id_good'];
    $quantity = (int)$_POST['quantity'];

    $price_data = getRowResult("SELECT good_price FROM goods WHERE id_good = ".$id_good);

    if(isset($_SESSION['user']) && $id_good > 0 && $quantity > 0 && $price_data['good_price'] > 0){
        for($i = 0; $i < $quantity; $i++){
            $sql = "INSERT INTO basket (id_user, id_good, price, is_in_order) VALUES(".$_SESSION['user']['id_user'].", ".$id_good.", ".$price_data['good_price'].", 0)";

            if(executeQuery($sql)){
                $response['result'] = 1;
            }
        }
    }
}

function removeProductFromBasket(&$response){
    $id_basket = (int)$_POST['id_basket'];

    if(isset($_SESSION['user'])){
        //проверяем, принадлежит ли корзина текущему пользователю
        $basket_data = getRowResult("SELECT id_user FROM basket WHERE id_basket = ".$id_basket);
        if($basket_data['id_user'] == $_SESSION['user']['id_user']){
            // можем удалять
            $sql = "DELETE FROM basket WHERE id_basket = ".$id_basket;
            if(executeQuery($sql)){
                $response["result"] = 1;
            }
        }
    }
}