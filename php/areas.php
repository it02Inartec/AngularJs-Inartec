<?php
include 'ChromePhp.php';
ChromePhp::log('Llego a areas.php!');
// El script de conexión de base de datos mysql
require_once '../php/conexion.php';
$status = '%';
if(isset($_GET['status'])){
	$status = $_GET['status'];
}
$query = "select * from  tbl_areas";
$result = $mysqli->get_results($query);

ChromePhp::log($result);

$arr = array();
if(!empty($result)){
	foreach($result as $k=>$v){
		$arr[] = $v;
	}
}

# JSON-codificar la respuesta
echo $json_response = json_encode($arr);
?>