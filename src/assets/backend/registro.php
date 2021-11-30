<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	
include("conexion.php");

$stdClass = new stdClass();
$stdClass->error = "0";
$stdClass->message = null;

$response = [];


if(isset($_GET['id'])){
	
	$profesorId = mysqli_real_escape_string($con,(strip_tags($_GET['id'], ENT_QUOTES)));
	
	$params = null;
	$postdata = file_get_contents("php://input");
	
	try {
		if(isset($postdata) && !empty($postdata)) {
			// Extract the data.
			$params = json_decode($postdata);
			
			$response['params'] = $params;
			
			if (isset($params) && $params != null) {
				
				$cedulaEstudiante = mysqli_real_escape_string($con,(strip_tags($params->cedulaEstudiante, ENT_QUOTES)));
				$nombresEstudiante = mysqli_real_escape_string($con,(strip_tags($params->nombresEstudiante,ENT_QUOTES)));
				$apellidosEstudiante = mysqli_real_escape_string($con,(strip_tags($params->apellidosEstudiante,ENT_QUOTES)));
				
				$sqlCheck = "SELECT * FROM estudiantes WHERE cedula='$cedulaEstudiante'";
				
				$check = mysqli_query($con, $sqlCheck);
				
				$response['sqlCheck'] = $sqlCheck;
				$response['check'] = $check;
				
				if(mysqli_num_rows($check) == 0){
						
						$sqlInsertEstudiante = "INSERT INTO estudiantes(cedula, nombres, apellidos)
															VALUES('$cedulaEstudiante','$nombresEstudiante', '$apellidosEstudiante')";
						
						$insertEstudiante = mysqli_query($con, $sqlInsertEstudiante) or die(mysqli_error());
						
						if($insertEstudiante) {
							
							$newEstudianteId = mysqli_insert_id($con);							
							$sqlInsertProfesorEstudiante = "INSERT INTO profesores_estudiantes
																	VALUES('$profesorId','$newEstudianteId')";							
							$insertProfesorEstudiante = mysqli_query($con, $sqlInsertProfesorEstudiante) or die(mysqli_error());
							
							if($insertProfesorEstudiante) {
								$response['error'] = 0;
								$response['message'] = "Los datos se registraron correctamente";
							} else  {
								$response['error'] = 1;
								$response['message'] = "Error al registrar el estudiante con el profesor seleccionado";
							}							
						}else{
							$response['error'] = 1;
							$response['message'] = "Error al registrar los datos del estudiante";
						}
					 
				}else{
					$response['error'] = 1;
					$response['message'] = "El estudiante ya esta registrado";
				}
			} else {
				$response['error'] = 1;
				$response['message'] = "No llegaron los datos para el registro";
			}
		}
	} catch (Exception $e) {
		$response['error'] = 1;
		$response['mensaje'] = $e->getMessage();
	}
} else {
	$response['error'] = 1;
	$response['mensaje'] = 'Codigo del profesor vacio';	
}

//$json_data = json_encode((array) $stdClass);

// print_r($json_data); //{"name":"avatar","age":31}
// echo $json_data;
echo json_encode($response);
?>