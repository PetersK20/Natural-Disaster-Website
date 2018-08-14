var features;
function createMap() {
    createInstaFeed();
            
    var mapCenter = {lat: 32, lng: -89};
    	
    var mapHolder = document.getElementById("mapHolder");
    var mapOptions = {
    	center: mapCenter,
    	zoom: 3
    };
    	
    map = new google.maps.Map(mapHolder, mapOptions);
    
    map.data.setStyle(styleFeature);

    //Get the earthquake data (JSONP format)
    //This feed is a copy from the USGS feed, you can find the originals here:
    //http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
    var script = document.createElement('script');
        script.setAttribute(
            'src',
            'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02&callback=eqfeed_callback');
    document.getElementsByTagName('head')[0].appendChild(script);

      
    google.maps.event.addDomListener(window, "resize", function() {
    	var center = map.getCenter();
    	google.maps.event.trigger(map, "resize");
    	map.setCenter(center); 
	});
}
	
    // Defines the callback function referenced in the jsonp file.
    function eqfeed_callback(data) {
        features=map.data.addGeoJson(data);
    }

    function styleFeature(feature) {
        var low = [151, 83, 34];   // color of mag 1.0
        var high = [5, 69, 54];  // color of mag 6.0 and above
        var minMag = 1.0;
        var maxMag = 6.0;

        // fraction represents where the value sits between the min and max
        var fraction = (Math.min(feature.getProperty('mag'), maxMag) - minMag) /
            (maxMag - minMag);

        var color = interpolateHsl(low, high, fraction);

        return {
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            strokeWeight: 0.5,
            strokeColor: '#fff',
            fillColor: color,
            fillOpacity: 2 / feature.getProperty('mag'),
            // while an exponent would technically be correct, quadratic looks nicer
            scale: Math.pow(feature.getProperty('mag'), 2)
          },
          zIndex: Math.floor(feature.getProperty('mag'))
        };
      }

      function interpolateHsl(lowHsl, highHsl, fraction) {
        var color = [];
        for (var i = 0; i < 3; i++) {
          // Calculate color based on the fraction.
          color[i] = (highHsl[i] - lowHsl[i]) * fraction + lowHsl[i];
        }

        return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)';
      }

      var mapStyle = [{
        'featureType': 'all',
        'elementType': 'all',
        'stylers': [{'visibility': 'off'}]
      }, {
        'featureType': 'landscape',
        'elementType': 'geometry',
        'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
      }, {
        'featureType': 'water',
        'elementType': 'labels',
        'stylers': [{'visibility': 'off'}]
      }, {
        'featureType': 'water',
        'elementType': 'geometry',
        'stylers': [{'visibility': 'on'}, {'hue': '#5f94ff'}, {'lightness': 60}]
      }];
      
        
    //var heatmap = new google.maps.visualization.HeatmapLayer({
    //    data: heatmapData
    //});
    //heatmap.setMap(map);

function updateMap(){
    for (var x = 0; x < features.length; x++){
        map.data.remove(features[x]);
    }
    var script = document.createElement('script');
    var limit=$("#limit option:selected").text();
    var startDate=$("#startDate").val();
    var endDate=$("#endDate").val();

    var magnitude1=Number($("#magnitudeSelect1 option:selected").text());
    var magnitude2=Number($("#magnitudeSelect2 option:selected").text());
    var magnitudeMin;
    var magnitudeMax;
    if(magnitude1>magnitude2){
        magnitudeMin=magnitude2;
        magnitudeMax=magnitude1;
    }else{
        magnitudeMax=magnitude2;
        magnitudeMin=magnitude1;
    }
    
    var query="https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&callback=eqfeed_callback&limit="+limit+"&starttime="+startDate+"&endtime="+endDate+"&minmagnitude="+magnitudeMin+"&maxmagnitude="+magnitudeMax;
    script.setAttribute(
        'src',
        query);
    document.getElementsByTagName('head')[0].appendChild(script);
}


//adds one to the startDate then gets the data for that day then removes the past data then adds the new data waits 1 seconds and repeats
var animateStartDate;
var transitionTime;
var continueAnimation=true;
function animateMap(){
    
    transitionTime=Number($("#transitionTime option:selected").text())*1000;
    
    var startDate=$("#startDate").val();
    var startDateParts=startDate.split('-');
    animateStartDate = new Date(startDateParts[0], startDateParts[1]-1, startDateParts[2]); 
     
    var endDate=$("#endDate").val();
    var endDateParts=endDate.split('-');
    animateEndDate = new Date(endDateParts[0], endDateParts[1]-1, endDateParts[2]); 
    
    if(animateEndDate.setHours(0,0,0,0)<=animateStartDate.setHours(0,0,0,0)){
        return;
    }
        
    updateAnimateMap();
}


function updateAnimateMap(){
    animateStartDate.setDate(animateStartDate.getDate()+1);
    $("#startDate").val(animateStartDate.getUTCFullYear()+"-"+(animateStartDate.getUTCMonth()+1)+"-"+animateStartDate.getUTCDate());
    var script = document.createElement('script');
    var limit=$("#limit option:selected").text();
    var startDate=$("#startDate").val();
    var startDateParts=startDate.split('-');
    var endDate=startDateParts[0]+"-"+(startDateParts[1])+"-"+(Number(startDateParts[2])+1); 
    


    var magnitude1=Number($("#magnitudeSelect1 option:selected").text());
    var magnitude2=Number($("#magnitudeSelect2 option:selected").text());
    var magnitudeMin;
    var magnitudeMax;
    if(magnitude1>magnitude2){
        magnitudeMin=magnitude2;
        magnitudeMax=magnitude1;
    }else{
        magnitudeMax=magnitude2;
        magnitudeMin=magnitude1;
    }
    
    var query="https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&callback=eqfeedAnimate_callback&limit="+limit+"&starttime="+startDate+"&endtime="+endDate+"&minmagnitude="+magnitudeMin+"&maxmagnitude="+magnitudeMax;

    script.setAttribute(
        'src',
        query);
    document.getElementsByTagName('head')[0].appendChild(script);
    
}
function eqfeedAnimate_callback(data) {
    for (var x = 0; x < features.length; x++){
        map.data.remove(features[x]);
    }
    features=map.data.addGeoJson(data);
    
    setTimeout(function(){  
        if(animateEndDate.setHours(0,0,0,0)==animateStartDate.setHours(0,0,0,0)||!continueAnimation){
            continueAnimation=true;
            return;
        }
        
        updateAnimateMap();
        
    }, transitionTime);
}
function stopAnimation(){
    continueAnimation=false;
}
