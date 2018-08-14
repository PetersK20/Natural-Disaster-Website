<?php

    require_once('../../../mysqli_connect_dr.php');

    $jsonObject= new stdClass();	    	
	
	$userName = $_POST['username'];
    $password = $_POST['password'];

    if($userName!=="" && $password!==""){
        $loginValidated=validateLogin($dbc,$userName,$password);
    }else{
        $loginValidated=false;
    }
    mysqli_close($dbc);

    if($loginValidated){
        header("Location: https://www.permanentroadtrip.com/DisasterRelief/WebContent/RecordDamages/DamageRecords.php?id=".rand(),true,301);
        die();
    }else{
        header("Location: https://www.permanentroadtrip.com/DisasterRelief/WebContent/RecordDamages/LoginPage.php?error=true",true,301);
        die();
    }
	
	//checks if there is an array that is returned from the login table where username=$usersName AND password=$password then either returns true or false
	function validateLogin($dbc,$userName,$password){

        $response=$dbc->prepare("SELECT * FROM login where username=? and password=?");
        $response->bind_param("ss", $userName, $password);
        $response->execute();


    	if($response){
    		while($response->fetch()){
                mysqli_stmt_close($response);
                setcookie('loggedin', 'true', time() + 1200, 'https://www.permanentroadtrip.com/DisasterRelief/WebContent/RecordDamages/DamageRecords.php');
                return true;
    		}
    		return false;
	    }else{
    		echo "Couldn't issue database query<br />";
    		echo mysqli_error($dbc);
	    }
	    mysqli_stmt_close($response);
        return false;
    }

?>