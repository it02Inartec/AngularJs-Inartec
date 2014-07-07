<?php
include_once('ez_sql_core.php');
include_once ('ez_sql_mysql.php');
//$DB_HOST = '127.0.0.1';
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = '123';
$DB_NAME = 'usuario';
$mysqli = new ezSQL_mysql($DB_USER, $DB_PASS, $DB_NAME, $DB_HOST);
?>