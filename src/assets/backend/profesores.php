    <?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    $conn = new mysqli('localhost','root','','id14906430_ppe');
    $sql = "SELECT id, nombre, count(pe.id_estudiante) cantidad, cantidad_max cantidadMax, p.proyecto, p.cursos ";
	$sql .= "FROM profesores p left join profesores_estudiantes pe on pe.id_profesor = p.id ";
	$sql .= "group by id, nombre ";
    $result = $conn->query($sql);
    $myArr = array();
    if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
    $myArr[] = $row;
    }
    } else {
    echo "0 results";
    }
    $myJSON = json_encode($myArr);
    echo $myJSON;