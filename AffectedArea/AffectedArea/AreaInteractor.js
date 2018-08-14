var map;
var geocoder;
//mapJson: mapData=[title={},image=[], description=[], state={}, latitude={}, longitude={},keyWords={}]
var mapJson;
var allMarkers=[];
var activeSearchMarker;
function getDataJson(){
  
    $.get("https://www.permanentroadtrip.com/DisasterRelief/WebContent/Server.php?command=getdisasterAreas&id="+Math.random(), function(data){
        mapJson=JSON.parse(data);
        createMap();
        createInstaFeed();
    });

}

function createMap() {
	
	var mapHolder = document.getElementById("mapHolder");
	var mapOptions = {
		center: new google.maps.LatLng(39, -98),
		zoom: 4
	};
	map = new google.maps.Map(mapHolder, mapOptions);
	
    geocoder = new google.maps.Geocoder();

    document.getElementById('geocodingButton').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });
    var input = document.getElementById('geocodingText');
    var autocomplete = new google.maps.places.Autocomplete(input);
    
    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    
    activeSearchMarker = new google.maps.Marker({
    	map: map,
    	anchorPoint: new google.maps.Point(0, -29)
    });
    
    var urlGeocode=window.location.search.split("?searchQuery=");
    var urlAutocomplete=window.location.search.split("?latlng=");
    //geocodes the query if user hit enter or uses the autocomplete method of showing the marker if the user hit an autocomplete sugestion
    var searchQuery;
	if(urlGeocode.length==2){
        searchQuery=urlGeocode[1];
        geocoder.geocode({'address': searchQuery}, function(results, status) {
            if (results[0].geometry.viewport){
    			map.fitBounds(results[0].geometry.viewport);
    		} else {
    			map.setCenter(results[0].geometry.location);
            	map.setZoom(4); 
    		}
    	    activeSearchMarker.setPosition(results[0].geometry.location);
    	    activeSearchMarker.setVisible(true);
        });
		$(window).scrollTop(600);
	}else if(urlAutocomplete.length==2){
	    searchQuery=urlAutocomplete[1];
	    searchQuery=searchQuery.replace(/["'()]/g,"");
	    var searchQuerylatlng=searchQuery.split(',%20');
        var latlng=new google.maps.LatLng(searchQuerylatlng[0],searchQuerylatlng[1]);
        
	    map.setCenter(latlng);
        map.setZoom(10);
        var marker = new google.maps.Marker();
        activeSearchMarker.setPosition(latlng);
    	activeSearchMarker.setVisible(true);
        $(window).scrollTop(600);
	}



	autocomplete.addListener('place_changed', function() {
		infowindow.close();
		activeSearchMarker.setVisible(false);
		var place = autocomplete.getPlace();

		// If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
        	map.setZoom(4); 
		}
	    activeSearchMarker.setPosition(place.geometry.location);
	    activeSearchMarker.setVisible(true);
	});

	for(var x=0;x<mapJson.mapData.length;x++){
		if(mapJson.mapData[x].type=="marker"){
			addMarkers(x);			
		}else{
			addPolygons(x);
		}
	}
	
	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center); 
		if($(document).width()<=500){
		map.setZoom(3);
		}else{
		map.setZoom(4);
		}
	});	
}


function addMarkers(x){
	if(damageTypeSpecified(x)){
		
		var markerIcon;
		var severity=mapJson.mapData[x].severity;
		if(severity=="high"){
			markerIcon="https://maps.google.com/mapfiles/ms/icons/red-dot.png";
		}else if(severity=="medium"){
			markerIcon="https://maps.google.com/mapfiles/ms/icons/orange-dot.png";
		}else{
			markerIcon="https://maps.google.com/mapfiles/ms/icons/green-dot.png";
		}
		
		
		var marker = new google.maps.Marker({
			position:new google.maps.LatLng(mapJson.mapData[x].latitude,mapJson.mapData[x].longitude),
			map:map,
			icon:markerIcon
		});
		
		allMarkers.push(marker);
		
		var markerDes="<h3>"+mapJson.mapData[x].title+"</h3><p>"+mapJson.mapData[x].description+"</p>";
		var infowindow = new google.maps.InfoWindow({
			content: markerDes
	    });
		
		
		
		google.maps.event.addListener(marker,'click',function(){
			infowindow.open(map, marker);
		});
	}

}
function addPolygons(x){
	//checks if the user wants the marker or polygon to be displayed based on if it is road or building damage

	if(damageTypeSpecified(x)){

		var latitudeArray=mapJson.mapData[x].latitude.split("~");
		var longitudeArray=mapJson.mapData[x].longitude.split("~");
		var polyCoords=[];
	
		for(var y=0;y<latitudeArray.length;y++){
			var coord={lat: Number(latitudeArray[y]), lng: Number(longitudeArray[y])};
			polyCoords.push(coord);
		}
		var startCoord={lat: Number(latitudeArray[0]), lng: Number(longitudeArray[0])};
		polyCoords.push(startCoord);
	
		var fillColor;
		var borderColor;
		var severity=mapJson.mapData[x].severity;
		if(severity=="high"){
			fillColor="red";
			borderColor="#f44336";
		}else if(severity=="medium"){
			fillColor="orange";
			borderColor="#ff9800";
		}else{
			fillColor="green";
			borderColor="#4CAF50";
		}
	    // Construct the polygon.
	    var polygon = new google.maps.Polygon({
	    	paths: polyCoords,
	        strokeColor: borderColor,
	        strokeOpacity: 0.8,
	        strokeWeight: 2,
	        fillColor: fillColor,
	        fillOpacity: 0.35
	    });
	    allMarkers.push(polygon);
	    polygon.setMap(map);
	    
	    
		var markerDes="<h3>"+mapJson.mapData[x].title+"</h3><p>"+mapJson.mapData[x].description+"</p>";
		var infowindow = new google.maps.InfoWindow({
			content: markerDes
	    });
		google.maps.event.addListener(polygon,'click',function(event){
			infowindow.setPosition(event.latLng);
			infowindow.open(map);
		});
		
	}
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

//checks if the user wants the marker or polygon to be displayed based on if it is road or building damage
function damageTypeSpecified(x){
	var showRoads=isCheckedById("roads");
	var showBuildings=isCheckedById("buildings");
	
	var damageType=mapJson.mapData[x].damageType;

	
	if(!showRoads && damageType=="road"){
		return false;
	}
	if(!showBuildings && damageType=="building"){
		return false;
	}
	return true;
}

function updateMap(){

	for (var x=0;x<allMarkers.length; x++) {
		allMarkers[x].setMap(null);
    }
	
	for(var x=0;x<mapJson.mapData.length;x++){
		if(mapJson.mapData[x].type=="marker"){
			addMarkers(x);			
		}else{
			addPolygons(x);
		}
	}
}

$(document).keydown(function(e) {
    var keynum;

    if(window.event){                  
        keynum = e.keyCode;
    }else if(e.which){               
        keynum = e.which;
    }
    
    if(keynum==13){//delete
        geocodeAddress(geocoder, map);
    }

});
function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('geocodingText').value;
    if(address==""){return;}
    geocoder.geocode({'address': address}, function(results, status) {
    	if (status === 'OK') {
    		// If the place has a geometry, then present it on a map.
    		if (results[0].geometry.viewport){
    			map.fitBounds(results[0].geometry.viewport);
    		} else {
    			map.setCenter(results[0].geometry.location);
            	map.setZoom(4); 
    		}
    	    activeSearchMarker.setPosition(results[0].geometry.location);
    	    activeSearchMarker.setVisible(true);
    	} else {
    		alert('Geocode was not successful for the following reason: ' + status);
    	}
    });
}
