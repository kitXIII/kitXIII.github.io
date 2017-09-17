<?php
// блок отзывов
function getFeedbacksFeed(){
    $sql = "SELECT * FROM feedback ORDER BY id_feedback DESC";
    $feed = getAssocResult($sql);

    return $feed;
}

function setFeedback(){
    $response = "";
    $db_link = getConnection();

    $feedback_user = mysqli_real_escape_string($db_link, (string)htmlspecialchars(strip_tags($_POST['name'])));
    $feedback_body = mysqli_real_escape_string($db_link, (string)htmlspecialchars(strip_tags($_POST['review'])));

    $sql = "INSERT INTO `feedback` (`feedback_body`, `feedback_user`) VALUES ('" .  $feedback_body. "', '" . $feedback_user . "')";
    $res = executeQuery($sql, $db_link);

    if(!$res)
        $response = "Произошла ошибка: " . $sql;
    else
        $response = "Отзыв добавлен";

    return $response;
}
