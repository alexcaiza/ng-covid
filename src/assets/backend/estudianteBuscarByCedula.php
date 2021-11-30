<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

include("conexion.php");

$response = [];

$response['estudiante'] = null;

if (!isset($_GET["cedula"]) || !isset($_GET["profesorId"])) {
	$response['error'] = 1;	
	if (!isset($_GET["cedula"])) {
		$response['mensaje'] = 'El campo cedula esta vacio';
	}
	if (!isset($_GET["profesorId"])) {
		$response['mensaje'] = 'El id del profesor esta vacio';
	}
}
else {
	$cedula = mysqli_real_escape_string($con,(strip_tags($_GET["cedula"],ENT_QUOTES)));
	$profesorId = mysqli_real_escape_string($con,(strip_tags($_GET["profesorId"],ENT_QUOTES)));
	
	$sql = "select * from estudiantes e where e.cedula = '$cedula'";
	$result = mysqli_query($con, $sql);
	
	$response['sql'] = $sql;
	
	$estudiante = null;
	
	if ($result) {
		$rows = mysqli_num_rows($result);
		if ($rows == 0) {
			$response['estudiante'] = null;
			$response['mensaje'] = "No se encontro el estudiante con la cedula: '$cedula'";
		} else {
			
			// Toma el estudiante de la consulta
			while ($row = mysqli_fetch_assoc($result)) {
				$estudiante = $row;
			}
			
			// Consulta los cursos del profesor
			$sqlProCur = "select * from profesores_cursos pc where pc.id_profesor = '$profesorId'";	
			$resultProCur = mysqli_query($con, $sqlProCur);
			$response['sqlProCur'] = $sqlProCur;
			
			if ($resultProCur) {
				
				$rowsProCur = mysqli_num_rows($resultProCur);
			
				if ($rowsProCur == 0) {					
					$response['mensaje'] = "El profesor no tiene cursos";
				} else {
					
					$bandEstudianteCurso = false;
					
					$str_cursos = "";
					$separador = "";
					
					// Valida si el curso del estudiante esta en los cursos del profesor
					while ($row = mysqli_fetch_assoc($resultProCur)) {
						$str_cursos .= $separador.$row["curso"];	
						$separador = ",";
						
						if ($row["curso"] == $estudiante["curso"]) {
							$bandEstudianteCurso = true;
						}
					}
					
					if ($bandEstudianteCurso == true) {
						$response['estudiante'] = $estudiante;
						$response['error'] = 0;
					} else {						
						$estudianteNombre = $estudiante["nombres"];
						$estudianteCurso = $estudiante["curso"];
						$response['mensaje'] = "El estudiante: '$estudianteNombre' del curso: '$estudianteCurso', no esta en los cursos del profesor: '$str_cursos' ";
					}
				}
			} else {
				$response['estudiante'] = null;
				$response['mensaje'] = "Error al consultar los cursos del profesor";
			}
		}
	} else {
		$response['estudiante'] = null;
		$response['mensaje'] = "Error al consultar los datos del estudiante";
	}
	$response['error'] = 0;
}
echo json_encode($response);