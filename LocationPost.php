<?php

    require_once('../../mysqli_connect_dr.php');
    
    $command = $_GET['command'];
    $jsonObject= new stdClass();
    
    $jsonString = $_POST['json'];
    $json=json_decode($jsonString);

    
    if(strcmp($command, "insertLocation")==0){
        insertIntoLocations($json,$dbc);
    }else if(strcmp($command, "deleteLocation")==0){
        deleteLocations($json,$dbc);
    }else if(strcmp($command, "insertAffectedArea")==0){
        insertAffectedArea($json,$dbc);
    }else if(strcmp($command, "deleteAffectedArea")==0){
        deleteAffectedArea($json,$dbc);
    }

    die();
    function deleteAffectedArea($json,$dbc){
        $worked=false;
        for($x=0;$x<sizeof($json);$x++){
            $stmt=$dbc->prepare("DELETE FROM disaster_areas where pkid=?");
    
    	    $pkid=$json[$x];
    	    $stmt->bind_param("s", $pkid);
                
            $stmt->execute();
                
            $affected_rows=mysqli_stmt_affected_rows($stmt);
    
            if($affected_rows >= 1){
                $worked=true;
            } else {
                echo 'Error Occurred '+mysqli_error();
            }
            
            mysqli_stmt_close($stmt);
        }
        if($worked){
            echo 'Entered Successfully';
        }
        mysqli_close($dbc);
    }
    function insertAffectedArea($json,$dbc){
        $worked=false;
        for($x=0;$x<sizeof($json);$x++){
            $stmt=$dbc->prepare("INSERT INTO disaster_areas (title, description, type, latitude, longitude, severity, damage_type) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    	    $title=$json[$x]->title;
    	    $description=$json[$x]->description;
    	    $type=$json[$x]->type;
    	    $latitude=$json[$x]->latitude;
    	    $longitude=$json[$x]->longitude;
    	    $severity=$json[$x]->severity;
    	    $damage_type=$json[$x]->damage_type;
    	
    	    $stmt->bind_param("sssssss", $title, $description, $type, $latitude, $longitude, $severity, $damage_type);
                
            $stmt->execute();
                
            $affected_rows=mysqli_stmt_affected_rows($stmt);
    
            if($affected_rows >= 1){
                $worked=true;
            } else {
                echo 'Error Occurred '+mysqli_error();
            }
            
            mysqli_stmt_close($stmt);
        }
        if($worked){
            echo 'Entered Successfully';
        }
        mysqli_close($dbc);
    }
    
    function deleteLocations($json,$dbc){
        $ip = $_SERVER['REMOTE_ADDR'];

        $stmt=$dbc->prepare("DELETE FROM user_locations WHERE pkid=?");
    	$stmt->bind_param("s", $ip);
        $stmt->execute();
        
        $affected_rows = mysqli_stmt_affected_rows($stmt);

        if($affected_rows >= 1){
            echo 'Deleted Successfully';
        } else {
            echo 'Error Occurred '+mysqli_error();
        }
            
        mysqli_stmt_close($stmt);
        mysqli_close($dbc);
    }
    
    function insertIntoLocations($json,$dbc){
        $ip = $_SERVER['REMOTE_ADDR'];

        $stmt=$dbc->prepare("REPLACE INTO user_locations (pkid, name, phone, description, latitude, longitude, personType) VALUES (?, ?, ?, ?, ?, ?,?)");

        $name=$json->name;
        if(strlen($name)==0){
            $name="Not Available";
        }

        $phone=$json->phone;
        if(strlen($phone)==0){
            $phone="Not Available";
        }
        $description=$json->description;
        if(strlen($description)==0){
            $description="Not Available";
        }
        $latitude=$json->latitude;
        $longitude=$json->longitude;
        $personType=$json->personType;
        
        if(validStrLen($name,30,"Name value") && validStrLen($phone,20,"Phone value") && validStrLen($description,200,"Description value")){
        
   
    	    $stmt->bind_param("ssssdds", $ip, $name, $phone, $description, $latitude, $longitude, $personType);
            
            $stmt->execute();
            
            $affected_rows = mysqli_stmt_affected_rows($stmt);

            if($affected_rows >= 1){
                echo 'Entered Successfully';
            } else {
                echo 'Error Occurred '+mysqli_error();
            }
        }
        mysqli_stmt_close($stmt);
        mysqli_close($dbc);
        
    }
    
    function validStrLen($str, $max, $fieldName){
        $len = strlen($str);

        if($len > $max){
            echo "$fieldName is too long, maximum is $max characters.";
            return false;
        }
        return true;
    }
?>