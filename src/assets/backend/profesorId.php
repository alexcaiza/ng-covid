    <?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    
	$conn = new mysqli('localhost','root','','id14906430_ppe');
	
	$id = mysqli_real_escape_string($conn,(strip_tags($_GET["profesorId"],ENT_QUOTES)));
    
	$sql = "SELECT id, nombre, count(pe.id_estudiante) cantidad ";
	$sql .= "FROM profesores p left join profesores_estudiantes pe on pe.id_profesor = p.id ";
	$sql .= "where p.id = '$id' ";
	$sql .= "group by id, nombre ";
    
	$result = $conn->query($sql);
    $data = null;
    if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
    $data = $row;
    }
    } else {
    echo "0 results";
    }
    $myJSON = json_encode($data);
    echo $myJSON;