<?php
/**
 * Created by PhpStorm.
 * User: apryakhin
 * Date: 21.09.2016
 * Time: 9:33
 */

$lib_files = scandir(LIB_DIR);

foreach ($lib_files as $file){
    if($file != "." && $file != ".."){
        if(substr($file, -8) == ".lib.php"){
            include_once (LIB_DIR . "/" . $file);
        }
    }
}