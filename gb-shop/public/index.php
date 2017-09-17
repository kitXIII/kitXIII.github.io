<?php
require_once('../config/config.php');

session_start();

//http://site.ru/index/edit/5

$url_array = explode("/", $_SERVER['REQUEST_URI']);

$page_name = "index";
if($url_array[1] != "")
	$page_name = $url_array[1];

$action = "";
if($url_array[2] != "")
    $action = $url_array[2];

$variables = prepareVariables($page_name, $action);

//_log($_POST);

$isAjax = ($action == "") ? false : true;

echo renderPage($page_name, $variables, $isAjax);
