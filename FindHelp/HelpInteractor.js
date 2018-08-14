var map;
var allMarkers=[];
//locationJson: locationData=[name={}, phone={}, description={}, latitude={}, longitude={},personType={}]
var locationJson;
var userLong;
var userLat;
var userSentLocation=false;
function getLocations(){
    $.get("https://www.permanentroadtrip.com/DisasterRelief/WebContent/Server.php?command=getUserLocations&id="+Math.random(), function(data){
        locationJson=JSON.parse(data);
        createMap();
        createInstaFeed();
    });
}
function createMap() {
    navigator.geolocation.getCurrentPosition(function(position) {
        userLat=position.coords.latitude;
		userLong=longitude=position.coords.longitude;
		
    	var mapCenter = {lat: userLat, lng: userLong};
    	
    	var mapHolder = document.getElementById("mapHolder");
    	var mapOptions = {
    		center: mapCenter,
    		zoom: 7
    	};
    	
    	map = new google.maps.Map(mapHolder, mapOptions);
    
        
    	google.maps.event.addDomListener(window, "resize", function() {
    		var center = map.getCenter();
    		google.maps.event.trigger(map, "resize");
    		map.setCenter(center); 
    	});	

	    for(var x=0;x<locationJson.locationData.length;x++){
		    addMarkers(x,2);			
	    }
	    
	    if(userSentLocation){
	        $("#locationStatus").text("Your location has been sent");
	    }else{
	         $("#locationStatus").text("Your location has not been sent");
	    }
	    addUserToMap();
	});
}

//updates map based on the radius passed
document.getElementById('radiusText').onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
        updateMap();
    }
}

function updateMap(){
    
    var radius=$(radiusText).val();
    
    if(validateRadiusInput(radius)){
        radius=Number(radius);
        if(radius<.00000001){//if user enter 0, their own dot will show up because of this if statement
            radius=.00000001
        }
        $("#radius-errorMessage").text("");
    }else{
        $("#radius-errorMessage").text("You didn't enter a value between 0-10");
        return;
    }
    
    var timestamp=Math.floor(Date.now() / 1000);
    $.get("https://www.permanentroadtrip.com/DisasterRelief/WebContent/Server.php?command=getUserLocations&timestamp="+timestamp, function(data){
        locationJson=JSON.parse(data);
    
        var length=allMarkers.length;
        for(var x=0; x<length;x++){
            allMarkers[x].setMap(null);
        }
        allMarkers=[];
        
    	for(var x=0;x<locationJson.locationData.length;x++){
    	    addMarkers(x,radius);			
    	}
    	addUserToMap();
    });
}

function validateRadiusInput(radius){
    if(radius===""||isNaN(radius)){
        return false;
    }else{
        radius=Number(radius);
        if(radius>10||radius<0){
            return false;
        }
    }
    return true;
}


//adds user locations to map
function addMarkers(x,radius){
	var markerLat=Number(locationJson.locationData[x].latitude);
	var markerLong=Number(locationJson.locationData[x].longitude);
	
	//uses the circle equation with the radius 2 and checks if the marker lat and long are in the circle - (x-h)squared+(y-k)squared=radius squared
	var disX=markerLat-userLat;//x-h
	var disY=markerLong-userLong;//y-k
	
	var latlngDis=disX*disX+disY*disY;//left side of equation
	var radiusSqr=radius*radius;//right side of equation
	if(latlngDis<radiusSqr){
    		
        var markerIcon;
        var personType=locationJson.locationData[x].personType;
        if(personType=="helper"){
        	markerIcon="https://maps.google.com/mapfiles/ms/icons/green-dot.png";
        }else if(personType=="needHelp"){
        	markerIcon="https://maps.google.com/mapfiles/ms/icons/red-dot.png";
        }else{//personType=="user"

        	userSentLocation=true;
            return;
        }
        		
        		
        var marker = new google.maps.Marker({
        	position:new google.maps.LatLng(markerLat,markerLong),
        	map:map,
        	icon:markerIcon
        });
        		
        allMarkers.push(marker);
        	
        var name=locationJson.locationData[x].name;
        var description=locationJson.locationData[x].description;
        var phone=locationJson.locationData[x].phone;
        var markerDes="<p>Name:"+name+"</p><p>Phone:"+phone+"</p><p>Description:"+description+"</p>";
        		
        var infowindow = new google.maps.InfoWindow({
        	content: markerDes
        });
        	    
        google.maps.event.addListener(marker,'click',function(){
        	infowindow.open(map, marker);
        });
    }

}
function addUserToMap(){
    markerIcon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    var marker = new google.maps.Marker({
    	position:new google.maps.LatLng(userLat,userLong),
    	map:map,
    	icon:markerIcon
    });
        		
    allMarkers.push(marker);
    var markerDes;
    if(userSentLocation){
        markerDes="You are broadcasting your location.";
    }else{
        markerDes="You are not broadcasting your location.";
    }
    var infowindow = new google.maps.InfoWindow({
        content: markerDes
    });
        	    
    google.maps.event.addListener(marker,'click',function(){
    	infowindow.open(map, marker);
    });
}

   
//sends user info to the server
setInterval(function() {
	if(isCheckedById("checkbox-broadcastLocation")){
	    sendLocation();
	}
},60000);

function sendLocation(){
    if ("geolocation" in navigator) {
        sendJson();
	} else {
		prompt(window,"extensions.foo-addon.allowGeolocation","Foo Add-on wants to know your location.",function callback(allowed) { alert(allowed); });
	}
		
}
//sends location to the server
function sendJson(){
	var name=$("#nameText").val();
	var phone=$("#phoneText").val();
	var description=$("#descriptionText").val();

	var json = {};
	json.name = name;
	json.phone  = phone;
	json.description = description;
	if(isCheckedById("needHelp")){
	    json.personType = "needHelp";
	}else{
	    json.personType = "helper";
	}
	
	navigator.geolocation.getCurrentPosition(function(position) {
		json.latitude=position.coords.latitude;
		json.longitude=position.coords.longitude;

    	jsonString=JSON.stringify(json);
    	var xhttp=new XMLHttpRequest();
    	
    	var timestamp=Math.floor(Date.now() / 1000);
        xhttp.open('POST', "https://www.permanentroadtrip.com/DisasterRelief/WebContent/LocationPost.php?command=insertLocation&timestamp="+timestamp, true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send("json="+jsonString);
            				
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            	$("#returnMessage-broadcast").text(xhttp.responseText);
            	$("#returnMessage-unbroadcast").text("");
            	if(xhttp.responseText=="Entered Successfully"){
            	    $("#locationStatus").text("Your location has been sent");
            	}
            }
        }
	});
}	
function deleteLocation(){
    var timestamp=Math.floor(Date.now() / 1000);
    $.get("https://www.permanentroadtrip.com/DisasterRelief/WebContent/LocationPost.php?command=deleteLocation&timestamp="+timestamp, function(data){
        if(data=="0"){
	        $("#returnMessage-unbroadcast").text("Your location has all ready been deleted from the database or an error occured");
        }else{
            $("#returnMessage-unbroadcast").text(data);
        }
        $("#returnMessage-broadcast").text("");
        
        if(data=="Deleted Successfully"){
	        $("#locationStatus").text("Your location has not been sent");
        }
    });
}













//allows app to use user's location
function prompt(window, pref, message, callback) {
    let branch = Components.classes["@mozilla.org/preferences-service;1"]
                           .getService(Components.interfaces.nsIPrefBranch);

    if (branch.getPrefType(pref) === branch.PREF_STRING) {
        switch (branch.getCharPref(pref)) {
        case "always":
            return callback(true);
        case "never":
            return callback(false);
        }
    }

    let done = false;

    function remember(value, result) {
        return function() {
            done = true;
            branch.setCharPref(pref, value);
            callback(result);
        }
    }

    let self = window.PopupNotifications.show(
        window.gBrowser.selectedBrowser,
        "geolocation",
        message,
        "geo-notification-icon",
        {
            label: "Share Location",
            accessKey: "S",
            callback: function(notification) {
                done = true;
                callback(true);
            }
        }, [
            {
                label: "Always Share",
                accessKey: "A",
                callback: remember("always", true)
            },
            {
                label: "Never Share",
                accessKey: "N",
                callback: remember("never", false)
            }
        ], {
            eventCallback: function(event) {
                if (event === "dismissed") {
                    if (!done) callback(false);
                    done = true;
                    window.PopupNotifications.remove(self);
                }
            },
            persistWhileVisible: true
        });
}

//checks if a checkMark is checked
function isCheckedById(id) {
   	var checked = $("#"+id+":checked").length;
   	if(checked == 0) {
   		return false;
   	}else {
   	    return true;
   	}
}

