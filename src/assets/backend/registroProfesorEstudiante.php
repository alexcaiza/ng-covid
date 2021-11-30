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
	
	$params = null;
	$postdata = file_get_contents("php://input");
	
	try {
		if(isset($postdata) && !empty($postdata)) {
			// Extract the data.
			$params = json_decode($postdata);
			
			$response['params'] = $params;
			
			if (isset($params) && $params != null) {
				
				$profesorId = mysqli_real_escape_string($con,(strip_tags($params->idProfesor,ENT_QUOTES)));
				$estudianteId = mysqli_real_escape_string($con,(strip_tags($params->idEstudiante, ENT_QUOTES)));
				
				if (isset($profesorId) && isset($estudianteId)) {					
				
					$sqlEstudiante = "SELECT * FROM estudiantes WHERE id='$estudianteId'";
				
					$checkEstudiante = mysqli_query($con, $sqlEstudiante);
					
					$response['sqlEstudiante'] = $sqlEstudiante;
					$response['checkEstudiante'] = $checkEstudiante;
					
					if(mysqli_num_rows($checkEstudiante) > 0) {
						
						$sqlProfesorEstudiante = "SELECT * FROM profesores_estudiantes WHERE id_estudiante='$estudianteId'";
				
						$checkProfesorEstudiante = mysqli_query($con, $sqlProfesorEstudiante);
						
						// Valida si el estudiante todavia no esta registrado
						if(mysqli_num_rows($checkProfesorEstudiante) == 0) {
							
							$sqlCountProfesorEstudiante = "SELECT count(pe.id_estudiante) cantidad, p.cantidad_max ";
							$sqlCountProfesorEstudiante .= "FROM profesores p left join profesores_estudiantes pe on pe.id_profesor = p.id ";
							$sqlCountProfesorEstudiante .= "WHERE p.id = '$profesorId' ";
							$sqlCountProfesorEstudiante .= "group by p.cantidad_max ";
							
							$resultCountProEst = mysqli_query($con, $sqlCountProfesorEstudiante);
							
							$cantidadMaximaEstudiantes = 0;
							$cantidadEstudiantesProfesor = 0;
							
							while ($rowCountProEst = mysqli_fetch_assoc($resultCountProEst)) {
								$cantidadMaximaEstudiantes = $rowCountProEst["cantidad_max"];
								$cantidadEstudiantesProfesor = $rowCountProEst["cantidad"];								
							}
							
							if ($cantidadEstudiantesProfesor < $cantidadMaximaEstudiantes) {
							
								// Registra el nuevo estudiante con el profesor seleccionado
								$sqlInsert = "INSERT INTO profesores_estudiantes VALUES('$profesorId','$estudianteId')";							
							
								$resultset = mysqli_query($con, $sqlInsert) or die(mysqli_error());
								
								if($resultset) {
									$response['error'] = 0;
									$response['message'] = "Los datos se registraron correctamente";
								} else  {
									$response['error'] = 1;
									$response['message'] = "Error al registrar el estudiante con el profesor seleccionado";
								}
							} else {
								$response['error'] = 1;
							$response['message'] = "El cupo para el profesor seleccionado ya esta lleno, por favor seleccione otro profesor.";
							}
						} else {
							$response['error'] = 1;
							$response['message'] = "El estudiante ya esta registrado";
						}			 
					}else{
						$response['error'] = 1;
						$response['message'] = "No existe el estudiante para el registrado: '$idEstudiante' ";
					}
				} else {
					$response['error'] = 1;
					$response['message'] = "El codigo proveedor, codigo estudiante estan vacios";
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

echo json_encode($response);
?>