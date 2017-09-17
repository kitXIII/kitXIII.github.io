<?php
/**
 * готовим страницу каталога
 * @param $page_vars
 */
function prepareCataloguePage(&$page_vars){
	$sql = "SELECT id_good, good_name, good_price, good_description";
	
	if (isAdmin())
		$sql .= ", is_active FROM goods";
	else
		$sql .= " FROM goods WHERE is_active = 1";
    
    $goods = getAssocResult($sql);
    
    foreach ($goods as $key => $value) {
    	$goods[$key]["is_active"] = $goods[$key]["is_active"] == '1' ? 'checked' : '';    	
    }
	
    
    $page_vars["goods"] = $goods;
}

//Выполняется без аякса для того чтобы администратор мог видеть весь каталог с изменениями после добавления товара
function addGood(){
	$response = "Ошибка дбавления товара";
    $db_link = getConnection();

    $good_name = mysqli_real_escape_string($db_link, (string)htmlspecialchars(strip_tags($_POST['name'])));
	$good_prise = number_format((float)$_POST['price'], 2, '.', '');
    $good_description = mysqli_real_escape_string($db_link, (string)htmlspecialchars(strip_tags($_POST['description'])));
    if(isset($_POST['isactive']) && $_POST['isactive'] == 'on')
    	$is_active = 1;
	else
    	$is_active = 0;

  	if ($good_name != '' && $good_prise > 0 && $good_description != '') {
    $sql = "INSERT INTO `goods` (`good_name`, `good_description`, `good_price`, `is_active`) 
    VALUES ('" .  $good_name . "', '" . $good_description . "', '" . $good_prise . "', '" . $is_active . "')";

    $res = executeQuery($sql, $db_link);

    if(!$res)
        $response = "Произошла ошибка: " . $sql;
    else
        $response = "Товар добавлен";
	} 
    return $response;
}

function doActionWithCatalogue($action) {
	$response = [
        "result" => 0,
    ];

    switch($action){
        case "change":
            changeGood($response);
            break;
        case "remove":
            removeGood($response);
            break;
    }

    return json_encode($response);
}

function changeGood(&$response){
	$db_link = getConnection();
	$id_good = (int)$_POST['id'];
    $good_name = mysqli_real_escape_string($db_link, (string)htmlspecialchars(strip_tags($_POST['name'])));
	$good_prise = number_format((float)$_POST['price'], 2, '.', '');
	$good_description = mysqli_real_escape_string($db_link, (string)htmlspecialchars(strip_tags($_POST['description'])));
    $is_active = (int)$_POST['isactive'];
 
  	$sql = "UPDATE `goods` SET `good_name` = '" .  $good_name . "', `good_description` = '" . $good_description . "', `good_price` = '" . $good_prise . "', `is_active` = '" . $is_active . "' WHERE `id_good` = '" . $id_good . "'";

    $res = executeQuery($sql, $db_link);

    if(!$res)
        $response['result'] = 0;
    else
        $response['result'] = 1;
    
    return $response;    
}

function removeGood(&$response){
	$db_link = getConnection();
	$id_good = (int)$_POST['id_good'];

	$sql = "DELETE FROM `goods` WHERE `id_good` = '" . $id_good . "'";

	$res = executeQuery($sql, $db_link);

    if(!$res)
        $response['result'] = 0;
    else
        $response['result'] = 1;
    
    return $response;
}