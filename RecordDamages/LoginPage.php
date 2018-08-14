<!DOCTYPE html>
<html>
<head>
	<meta name="robots" content="noindex,nofollow">
	<meta charset="ISO-8859-1">
	
	<!-- page description -->
	<meta name="description"
	content=""/>
	
	<!-- Keywords for search engine -->
	<meta name="keywords"
	content=""/>
	
	
	<title>Login</title>

	<!-- for bootstraps -->
	<meta name="viewport" content="width = device-width, initial-scale = 1">
	<!-- bootstraps -->
	<link rel="stylesheet" type=text/css href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<!-- Add social media icon library -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">	
	<!-- JQuery -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<!-- bootstraps -->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	
	<!-- Page stylesheets-->
	<link rel="stylesheet" href="../SiteStyleSheet.css">

	
	
</head>
<body onload="createInstaFeed();">

    <?php
	    $errorMessage="";
        $errorMessageVisible=$_GET['error'];
        $errorMessage=$errorMessageVisible;
        if(strcmp($errorMessageVisible, "true")==0){
            $errorMessage="The username or password is incorrect.";
        }
    ?>
    
	<div class="hidden-lg hidden-md" style="height:70px"></div>
	<!-- For sm and xs screen size - creates the panel that displays the title of the page, links to other pages, and the logo -->
	<div id="headerSm" class="hidden-lg hidden-md">
	

		<div id="headerSm-menuHolder" onclick="changeMenuIcon(this)">
  			<div id="headerSm-menuBar1"></div>
  			<div id="headerSm-menuBar2"></div>
  			<div id="headerSm-menuBar3"></div>
  			<h4 id="headerSm-menuLabel">Menu</h4>
		</div>
		
		<!-- displays the search icon at the top right of the screen-->
		<div id="headerSm-searchIconHolder">
			<span id="headerSm-searchIcon" class="glyphicon glyphicon-search"></span>
		</div>
		
		<div class="input-group input-group-lg" id="headerSm-searchBarHolder">
  				<input id="headerSm-searchBar" type="text" class="form-control" placeholder="Search Map Locations">
		</div>
		<!-- sets the searchBar invisible -->
		<script>$("#headerSm-searchBarHolder").hide();</script>
		
		<div align="center">
			<div id="headerSm-logo">
				<img width=70px height=70px class="img img-responsive" src="	https://www.worldvision.or.kr/images/icon/png/wv-05-relief01-emergency.png">
			</div>
		</div>
		
	</div>
		
	<!-- navSm is at the bottom of the page and will be animated to the top of the screen -->
	<div id="headerSm-navSm" class="hidden-lg hidden-md">
				
		<div class="navSm-pageLinkHolder">
			<h3 class="navSm-pageLink"><a href="https://www.permanentroadtrip.com/DisasterRelief/WebContent/AffectedArea/Area.html">Affected Area</a></h3>
		</div>
		<hr>
		<div class="navSm-pageLinkHolder">
			<h3 class="navSm-pageLink"><a href="https://www.permanentroadtrip.com/DisasterRelief/WebContent/FindHelp/Help.html">Find Help</a></h3>
		</div>
		<hr>
		<div class="navSm-pageLinkHolder">
			<h3 class="navSm-pageLink"><a href="https://www.permanentroadtrip.com/DisasterRelief/WebContent/ArchiveDisasters/Archive.html">Archived Disasters</a></h3>
		</div>
		<hr>
		<div class="navSm-pageLinkHolder">
			<h3 class="navSm-pageLink active"><a href="https://www.permanentroadtrip.com/DisasterRelief/WebContent/RecordDamages/DamageRecords.php">Record Damages</a></h3>
		</div>
	
	</div>
	
	<!-- For lg and md screen size - creates the panel that displays the pageTitle -->
	<div class="hidden-sm hidden-xs" id="headerLg-titleHolder">
		<!-- displays the page title -->
		<div align="center">
			<span id="headerLg-title">Disaster Relief</span>
		 	<span id="headerLg-socialMediaHolder">
				<a href="https://www.facebook.com/permanentroadtrip/" class="fa fa-facebook"></a>	
				<a href="https://www.youtube.com/channel/UCXN6XQ2Kmg9vUGCHmu71FTA" class="fa fa-youtube"></a>		
				<a href="https://www.instagram.com/permanentroadtrip/" class="fa fa-instagram"></a>
			</span>
	
		</div> 
		
	</div>
	
	<!-- For lg and md screen size - creates the panel that displays the links to other pages, and the logo -->
	<div id="headerLg" class="hidden-sm hidden-xs">

	
		<span id="headerLg-logo">
			<img width=70px height=70px class="img img-responsive" src="	https://www.worldvision.or.kr/images/icon/png/wv-05-relief01-emergency.png">
		</span>

		<!-- displays the map icon at the top right of the screen-->
		<div id="headerLg-searchIconHolder">
			<span id="headerLg-searchIcon" class="glyphicon glyphicon-search"></span>
		</div>
				
		<div class="input-group input-group-lg" id="headerLg-searchBarHolder">
  				<input id="headerLg-searchBar" type="text" class="form-control" placeholder="Search Map Locations">
		</div>
		<!-- sets the searchBar invisible -->
		<script>$("#headerLg-searchBarHolder").hide();</script>
		
		
		<!-- adds the page links -->
		<div align="center">
			<div id="headerLg-navLg">
	
				<div class="navLg-pageLinkHolder">
					<span class="navLg-pageLink"><a href="https://www.permanentroadtrip.com/DisasterRelief/WebContent/AffectedArea/Area.html">Affected Area</a></span>
				</div>
				<div class="navLg-pageLinkHolder">
					<span class="navLg-pageLink"><a href="https://www.permanentroadtrip.com/DisasterRelief/WebContent/FindHelp/Help.html">Find Help</a></span>
				</div>
				<div class="navLg-pageLinkHolder">
					<span class="navLg-pageLink"><a href="https://www.permanentroadtrip.com/DisasterRelief/WebContent/ArchiveDisasters/Archive.html">Archived Disasters</a></span>
				</div>
				<div class="navLg-pageLinkHolder active">
					<span class="navLg-pageLink"><a href="https://www.permanentroadtrip.com/DisasterRelief/WebContent/RecordDamages/DamageRecords.php">Record Damages</a></span>
				</div>
				
			</div>
		</div>
	</div>
	
	<div id="headerImg" style="background-image:url('https://newsroom.lowes.com/wp-content/uploads/2016/12/wide-fire-panorama.jpg')">

		<div class="container-fluid" align="center">
			<div class="col-xs-12 col-md-10">
				<h1>Login Page</h1> 
			</div>
			<div class="col-xs-12 col-md-10">
				<h3>In order to record damages, you must be authorized by us.</h3>
			</div>
		</div>	
		
	</div>
	
	
	<div id="contentWrapper" class="container-fluid">
		
		<br><br>
		<div class="row">
			<!-- offset is used to center the divs -->
			<div id="loginBox" style="padding:0px" class="col-lg-6 col-md-6 col-sm-8 col-xs-12 col-lg-offset-3 col-md-offset-3 col-sm-offset-2">
				<!-- creates a header to the login box -->
				<div id="loginBox-header">
					<div align="center" style="padding:5px">
						<h1>Login</h1>
					</div>
				</div>
				<br>
	            
	            <form action="LoginValidationServer.php" method="post">
    				<span id="loginBox-errorMessage"><?php echo $errorMessage;?></span>
    				<!-- creates the Username text box -->
    				<div class="input-group input-group-lg">
    					<span class="input-group-addon">Username</span>
    					<input type="text" class="form-control" name="username" id="usernameTextbox">
    				</div>
    				<br>
    
    				<div class="input-group input-group-lg">
    					<span class="input-group-addon">Password</span>
    					<input type="password" class="form-control" name="password" id="passwordTextbox">
    				</div>
    				<br>
    				<Button id="loginBox-button" type="submit" class="btn btn-lg btn-customGreen">Login
    				</Button>
    			</form>
			
			</div>
		</div>
	</div>
	
	
	
	<div id="footer">
	    <br>
		<div>
			<div align="left">
				<br>
				<h1 id="footer-instagramHeader">Instagram</h1>
				<div id="footer-instagram-headerUnderline"></div>
				<br>
			</div>
			
			<div id="instagramWrapper" class="tabcontent">
				<div id="instafeed" class="row"></div>
			</div>
	
		</div>
		
	    <div align="center">
	        
        	<div id="connect">
        	    <span id="connect-title"><strong>Connect with us: </strong></span>
        	    
        	    <div class="hidden-sm hidden-md hidden-lg">
            	    <br>
        	    </div>
        	    
        	   <button id="connect-emailButton" onclick="contactEmail()" class="btn btn-lg">  Email  </button>
        	    <script>
        	        function contactEmail(){
        	            window.open('mailto:Peters_K20@Moeller.org');
        	        }
        	    </script>
        	    <a href="https://www.linkedin.com/company/natural-disaster-support/">
        	        <button id="connect-linkedInButton" class="btn btn-lg"> LinkedIn </button>
        	   </a>
        	   <a href="https://www.instagram.com/natural_disaster_relief/">
        	        <button id="connect-instagramButton" class="btn btn-lg">Instagram</button>
        	   </a>
        	</div>
        	<br>
        	<div id="copyright">
        	    <p>Copyright &#9400; Disaster Relief 2018. All Rights Reserved.</p>
            </div>
        </div>
	</div>
	
	<script src="../SiteJavaScript.js"></script>
	<!-- instafeed.js -->
	<script src="../js/instafeed.min.js"></script>
</body>
</html>