<?php
include 'ChromePhp.php';
ChromePhp::log('Llego a consulta.php!');
// El script de conexión de base de datos mysql
require_once '../php/conexion.php';
$status = '%';
if(isset($_GET['status'])){
	$status = $_GET['status'];
}
$query = "select * from tbl_pacientes p
inner join tbl_consulta c on c.id_paciente=p.id_paciente
inner join tbl_areas a on a.id_area=c.id_area";

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