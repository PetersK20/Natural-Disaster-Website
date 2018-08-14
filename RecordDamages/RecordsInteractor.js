var map;
//mapJson: mapData=[pkid={},title={},description={}, type={}, latitude={}, longitude={},severity={},damage_type]
var mapJson;
var allMarkers=[];//db markers
var newMarkers=[];//markers user creates
var activeMarker="";//to delete if user presses the delete button
var drawingManager;
var newMarkerId=0;

function signOut(){
    window.location.href="https://www.permanentroadtrip.com/DisasterRelief/WebContent/RecordDamages/DamageRecords.php?signOut=true";
}
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
	
	    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker', 'polygon']
        },
        markerOptions: {icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'},
        polygonOptions: {
			strokeColor: "green",
	        strokeOpacity: 0.8,
	        strokeWeight: 2,
	        fillColor: "#4CAF50",
	        fillOpacity: 0.35
        }

    });
    drawingManager.setMap(map);
    
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
        newMarkers.push(polygon);
        polygon.setOptions({
            newId:newMarkerId
        });       
        newMarkerId++;
        addPolygonDb(polygon);
    });
    google.maps.event.addListener(drawingManager, 'markercomplete', function(marker){
        newMarkers.push(marker);
        marker.setOptions({
            newId:newMarkerId
        });   
        addMarkerDb(marker);
    });
    
    var geocoder = new google.maps.Geocoder();

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
    
    var marker = new google.maps.Marker({
    	map: map,
    	anchorPoint: new google.maps.Point(0, -29),
    	icon:"https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    });

	autocomplete.addListener('place_changed', function() {
		infowindow.close();
		marker.setVisible(false);
		var place = autocomplete.getPlace();

		// If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
        	map.setZoom(7); 
		}
	    marker.setPosition(place.geometry.location);
	    marker.setVisible(true);
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
//adds markers and polygons from db
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
			icon:markerIcon,
			id:mapJson.mapData[x].pkid
		});

		allMarkers.push(marker);
		
		var markerDes="<h3>"+mapJson.mapData[x].title+"</h3><p>"+mapJson.mapData[x].description+"</p>";
		var infowindow = new google.maps.InfoWindow({
			content: markerDes
	    });
		
		
		
		google.maps.event.addListener(marker,'click',function(){
		    activeMarker=marker;
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
	        fillOpacity: 0.35,
	        id:mapJson.mapData[x].pkid
	    });
	    allMarkers.push(polygon);
	    polygon.setMap(map);
	    
	    
		var markerDes="<h3>"+mapJson.mapData[x].title+"</h3><p>"+mapJson.mapData[x].description+"</p>";
		var infowindow = new google.maps.InfoWindow({
			content: markerDes
	    });
		google.maps.event.addListener(polygon,'click',function(event){
		    activeMarker=polygon;
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


function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('geocodingText').value;
    if(address==""){return;}
    geocoder.geocode({'address': address}, function(results, status) {
    	if (status === 'OK') {
    		resultsMap.setCenter(results[0].geometry.location);
    		var marker = new google.maps.Marker({
    			map: resultsMap,
    			position: results[0].geometry.location
    		});
    	} else {
    		alert('Geocode was not successful for the following reason: ' + status);
    	}
    });
}




/*sets colors of markers based on severity of disaster*/
function updateMapDrawing(){
    
    var severity=document.querySelector('input[name="severity"]:checked').value;
    var icon;
	if(severity=="high"){
		fillColor="red";
		borderColor="#f44336";
		icon='https://maps.google.com/mapfiles/ms/icons/red-dot.png';
	}else if(severity=="medium"){
		fillColor="orange";
		borderColor="#ff9800";
		icon='https://maps.google.com/mapfiles/ms/icons/orange-dot.png';
	}else{
		fillColor="green";
		borderColor="#4CAF50";
		icon='https://maps.google.com/mapfiles/ms/icons/green-dot.png';
	}
	    
    drawingManager.setOptions({
        polygonOptions: {
            strokeColor: borderColor,
	        strokeOpacity: 0.8,
	        strokeWeight: 2,
	        fillColor: fillColor,
	        fillOpacity: 0.35
        },       
        markerOptions: {icon: icon}
    });
}

//mapJson: mapData=[pkid={},title={},description={}, type={}, latitude={}, longitude={},severity={},damage_type]
//each time user draws or deletes, changes are stored in either the addList or deleteList.  These liss are then used to make the changes on the db when the updateDatabase button is pressed

//adds polygon to db
function addPolygonDb(polygon){
    
    var polygonBounds = polygon.getPath();
    var latitude="";
    var longitude="";
    for (var x=0;x<polygonBounds.length;x++)
    {
        latitude+=polygonBounds.getAt(x).lat();
        longitude+=polygonBounds.getAt(x).lng();
        if(x!==polygonBounds.length-1){
            latitude+="~";
            longitude+="~";
        }
    }

    var markerDes= addJsonIndex(polygon,"polygon",latitude,longitude);
    
	var infowindow = new google.maps.InfoWindow({
		content: markerDes
	});
	google.maps.event.addListener(polygon,'click',function(event){
	    activeMarker=polygon
        infowindow.setPosition(event.latLng);
		infowindow.open(map);
	});
}
//adds markers to db
function addMarkerDb(marker){
    var markerPosition=marker.getPosition();
    var latitude=markerPosition.lat();
    var longitude=markerPosition.lng();
    var markerDes=addJsonIndex(marker,"marker", latitude, longitude);

	var infowindow = new google.maps.InfoWindow({
		content: markerDes
	});
	google.maps.event.addListener(marker,'click',function(){
		activeMarker=marker;
	    infowindow.open(map, marker);
	});
	
}

var addList=[];//addList:[title={},description={}, type={}, latitude={}, longitude={},severity={},damage_type]
var deleteList=[];//deleteList=[pkid,pkid]
//adds index to the addList
function addJsonIndex(marker,type,latitude,longitude){
    var id=marker.newId;
    var title=$("#titleText").val();
    var description=$("#descriptionText").val();
    var severity=document.querySelector('input[name="severity"]:checked').value;
    var damage_type=document.querySelector('input[name="addType"]:checked').value;
    if(title===""&&description===""){
        title="Info Not Available";
    }

	var json = new Object();
	json.id=id;
	json.title = title;
	json.description  = description;
	json.type = type;
	json.latitude = latitude;
	json.longitude = longitude;
	json.severity = severity;
	json.damage_type = damage_type;
	
	addList.push(json);
	
	addMemento("add",marker);
	
	var markerDes="<h3>"+title+"</h3><p>"+description+"</p>";
	return markerDes;
}
//sends addList to server to update the db
function updateDatabaseInsert(){
    updateDatabaseDelete();
    var jsonString=JSON.stringify(addList);
	if(jsonString!==""){
		var xhttp=new XMLHttpRequest();
    	var timestamp=Math.floor(Date.now() / 1000);
        xhttp.open('POST', "https://www.permanentroadtrip.com/DisasterRelief/WebContent/LocationPost.php?command=insertAffectedArea&timestamp="+timestamp, true);
		xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhttp.send("json="+jsonString);
				
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				$("#returnMessage-updateDB").text(xhttp.responseText);
				if(xhttp.responseText="Entered Successfully"){
				    addList=[];  
				}
			}
		}
	}
}
function updateDatabaseDelete(){
    var jsonString=JSON.stringify(deleteList);
	if(jsonString!==""){
		var xhttp=new XMLHttpRequest();
    	var timestamp=Math.floor(Date.now() / 1000);
        xhttp.open('POST', "https://www.permanentroadtrip.com/DisasterRelief/WebContent/LocationPost.php?command=deleteAffectedArea&timestamp="+timestamp, true);
		xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhttp.send("json="+jsonString);
				
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				$("#returnMessage-updateDB").text(xhttp.responseText);
				if(xhttp.responseText="Entered Successfully"){
				    deleteList=[];  
				}
			}
		}
	}
}

function deleteActiveMarker(){
    if(activeMarker==""){return;}
    
    if(activeMarker.id==null){//shows marker is not in db(user created this one)
        deleteJsonIndex(activeMarker.newId); 
      
    }else{
        var activeMarkerId=activeMarker.id;
        for(x=0;x<allMarkers.length;x++){
          
            if(allMarkers[x].id===activeMarkerId){
                
                deleteMarkerDb(activeMarkerId);
                
            }
        }
    }
    addMemento("remove",activeMarker);
    activeMarker.setMap(null);
    activeMarker=="";
}
//deletes json from the db
function deleteMarkerDb(activeMarkerId){
	deleteList.push(activeMarkerId);
}
//deletes array index in addList
function deleteJsonIndex(markerId){
    for(var x=0;x<addList.length;x++){
        if(addList[x].id==markerId){
            deletedAddList.push(addList[x]);
            addList.splice(x, 1);
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
    
    if(keynum==46){//delete
        deleteActiveMarker();
    }else if(keynum==90){//ctrl z
        undo();
    }else if(keynum==89){//ctrl y
        redo();
    }

});
var deletedAddList=[];//stores indexes removed from addList
var currentMemento=0;
var mementoHolder=[];
function addMemento(command,memento){
    
    //when user undos then adds a marker, the currentMemento and mementoHolder will not be in sync.  This fixes it
    for(var x=mementoHolder.length;x>=currentMemento;x--){
        mementoHolder.splice(x, 1);
    }
    var json = new Object();
	json.command=command;
	json.memento = memento;
	
    mementoHolder.push(json);
    currentMemento++;
}
function undo(){
    if(currentMemento==0){return;}
    currentMemento--;
    var mapMarker=mementoHolder[currentMemento];
    if(mapMarker.command=="add"){
        mapMarker.memento.setMap(null);
        
        var mementoId=mapMarker.memento.newId;
        
        //removes the marker from the addList
        for(var x=0;x<addList.length;x++){
            if(addList[x].id==mementoId){
                deletedAddList.push(addList[x]);
                addList.splice(x, 1);
            }
        }
        
    }else{//command=="remove"    
        mapMarker.memento.setMap(map);

        var mementoId=mapMarker.memento.newId;
        
        if(mementoId==null){//marker is in db - must remove marker from deleteList
            mementoId=mapMarker.memento.id;

            //removes the marker form the addList
            for(var x=0;x<deleteList.length;x++){
                if(deleteList[x]==mementoId){
                    deleteList.splice(x, 1);
                }
            }
            
        }else{//marker was created by user - must put marker back on addList
            for(var x=0;x<deletedAddList.length;x++){
                if(deletedAddList[x].id==mementoId){
                    addList.push(deletedAddList[x]);
                    deletedAddList.splice(x, 1);
                }
            }
        }
    }
}
function redo(){
    if(currentMemento==mementoHolder.length){return;}
    var mapMarker=mementoHolder[currentMemento];
    if(mapMarker.command=="add"){
        mapMarker.memento.setMap(map);
        
        var mementoId=mapMarker.memento.newId;
        //adds the marker from the addList
        
        for(var x=0;x<deletedAddList.length;x++){
            if(deletedAddList[x].id==mementoId){
                addList.push(deletedAddList[x]);
                deletedAddList.splice(x, 1);
            }
        }
    }else{//command=="remove"    
        mapMarker.memento.setMap(null);

        var mementoId=mapMarker.memento.newId;
        
        if(mementoId==null){//marker is in db - must add marker to deleteList
            mementoId=mapMarker.memento.id;
            
            deleteList.push(mementoId);
            
        }else{//marker was created by user - must remove marker from the addList
            for(var x=0;x<addList.length;x++){
                if(addList[x].id==mementoId){
                    deletedAddList.push(addList[x]);
                    addList.splice(x, 1);
                }
            }
        }
    }
    currentMemento++;
}


