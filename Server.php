<?php

    require_once('../../mysqli_connect_dr.php');
    
    $command = $_GET['command'];
    $jsonObject= new stdClass();	    	
    if(strcmp($command, "getdisasterAreas")==0){
    	$jsonObject=getdisasterAreas($dbc,$jsonObject);
    	$json= json_encode($jsonObject);
    }else if(strcmp($command, "getUserLocations")==0){
        $jsonObject=getUserLocations($dbc,$jsonObject);
    	$json= json_encode($jsonObject);
    }
    
	// Close connection to the database
	mysqli_close($dbc);
	echo $json;
function getUserLocations($dbc,$jsonObject){
    $ip = $_SERVER['REMOTE_ADDR'];
    // Get a response from the database by sending the connection and the query
    $response=$dbc->query("SELECT * FROM user_locations");
    
	//creates jsonObject for each index of the db and inserts them into the mapArray
	//This array is then added to the jsonObject that will be returned
	$locationArrayPhp = array();

	// If the query executed properly proceed
	if($response){
		while($dbResults = mysqli_fetch_array($response)){
            $dbIndexObject= new stdClass();
			$dbIndexObject->name=$dbResults['name'];
			$dbIndexObject->phone=$dbResults['phone'];
			$dbIndexObject->description=$dbResults['description'];
			$dbIndexObject->latitude=$dbResults['latitude'];
			$dbIndexObject->longitude=$dbResults['longitude'];
			if($ip==$dbResults['pkid']){
			    $dbIndexObject->personType="user";
			}else{
    			$dbIndexObject->personType=$dbResults['personType'];
			}

			$locationArrayPhp[]=$dbIndexObject;
		}
	}else{

		echo "Couldn't issue database query<br />";

		echo mysqli_error($dbc);

	}
	$jsonObject->locationData = $locationArrayPhp;
	return $jsonObject;
}	
function getdisasterAreas($dbc,$jsonObject){

	// Get a response from the database by sending the connection and the query
    $response=$dbc->query("SELECT * FROM disaster_areas");
    
	//creates jsonObject for each index of the db and inserts them into the mapArray
	//This array is then added to the jsonObject that will be returned
	$mapArrayPhp = array();

	// If the query executed properly proceed
	if($response){
		while($dbResults = mysqli_fetch_array($response)){
            $dbIndexObject= new stdClass();
            
           
            $dbIndexObject->pkid=$dbResults['pkid'];
			$dbIndexObject->title=$dbResults['title'];
			$dbIndexObject->description=$dbResults['description'];
			$dbIndexObject->type=$dbResults['type'];
			$dbIndexObject->latitude=$dbResults['latitude'];
			$dbIndexObject->longitude=$dbResults['longitude'];
			$dbIndexObject->severity=$dbResults['severity'];
			$dbIndexObject->damageType=$dbResults['damage_type'];

			$mapArrayPhp[]=$dbIndexObject;
		}
	}else{

		echo "Couldn't issue database query<br />";

		echo mysqli_error($dbc);

	}
	$jsonObject->mapData = $mapArrayPhp;
	return $jsonObject;
}
?>