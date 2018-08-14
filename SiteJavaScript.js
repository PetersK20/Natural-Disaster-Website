//MENU LISTENER.js - toggles between the smPageLinks and mapSearchBar showing and not showing
$("document").ready(function(){
	var navBarHidden=true;
	
	var searchBarLg=document.getElementById("headerLg-searchBar");
	var searchBarSm=document.getElementById("headerSm-searchBar");
	
	var autocompleteLg = new google.maps.places.Autocomplete(searchBarLg);
	var autocompleteSm = new google.maps.places.Autocomplete(searchBarSm);

    google.maps.event.addListener(autocompleteLg, 'place_changed', function () {
        var place = autocompleteLg.getPlace();
        var searchQuery;
        
        if(place===null){
            searchQuery=$(searchBarLg).val();
            window.location="https://www.permanentroadtrip.com/DisasterRelief/WebContent/AffectedArea/Area.html?searchQuery="+searchQuery;
        }else{
            searchQuery=place.geometry.location;
            window.location="https://www.permanentroadtrip.com/DisasterRelief/WebContent/AffectedArea/Area.html?latlng="+searchQuery;
        }

	    $(searchBarLg).val("");

    });
    google.maps.event.addListener(autocompleteSm, 'place_changed', function () {
        var place = autocompleteSm.getPlace();
        var searchQuery;
        
        if(place===null){
            searchQuery=$(searchBarSm).val();
            window.location="https://www.permanentroadtrip.com/DisasterRelief/WebContent/AffectedArea/Area.html?searchQuery="+searchQuery;
        }else{
            searchQuery=place.geometry.location;
            window.location="https://www.permanentroadtrip.com/DisasterRelief/WebContent/AffectedArea/Area.html?latlng="+searchQuery;
        }
	    $(searchBarSm).val("");

    });
    
    
	//animates the navbar and the option div
	$("#headerSm-menuHolder").click(function(){
		if (navBarHidden){
			//animates the menu icon into an x
			document.getElementById("headerSm-menuHolder").classList.toggle("changedMenu");
			
			$("#headerSm-navSm").animate({left:0},200,function(){
				navBarHidden=false;
			});
			



			//creates black tint on the screen
			$("#focusDiv").animate({opacity:0.9},200);
			$("#focusDiv").css("z-index",3);
			
			//disables the ability to scroll
			$("body").css("overflow","hidden");

			setTimeout(function(){$("#headerSm-menuLabel").text("Done");}, 100);
		}
	});
	
	//gets rid of the option div when the user clicks on something else
	$('body').click(function(event) {
		//if navBar is hidden and the click in not on the navBar
	    if (!navBarHidden && !$(event.target).closest('#headerSm-navSm').length) {
	    	navBarHidden=true;
	    	changeWindowToDefault(200);	    	
	    }
	});
	
	$(window).resize(function(){
		//if the navbar is open and the screen size is lg or md
		if(!navBarHidden && $(window).width()>=992){
			navBarHidden=true;
			changeWindowToDefault(0);
		}
	});
	//changes window back to normal after the animations for the navbar
	function changeWindowToDefault(animationTime){
		//animates the x icon into a menu icon
		document.getElementById("headerSm-menuHolder").classList.toggle("changedMenu");
		
		$("#headerSm-navSm").animate({left:-500},animationTime);

					
		//removes black tint on the screen
		$("#focusDiv").animate({opacity:0.0},animationTime,function(){$("#focusDiv").css("z-index",1);});
		//enables the ability to scroll
		$("body").css("overflow","scroll");
		
		setTimeout(function(){$("#headerSm-menuLabel").text("Menu");}, animationTime/2);
	}


//NAVIGATION INTERACTOR.JS - toggles the mapTextBar between active and inactive and makes the navLg a sticky navbar

//listener for textfields that searches for map locations then redirects to the map.html page
	$("#headerLg-searchBar").keyup(function (e) {
		var searchQuery=$(this).val();
	    if (e.keyCode == 13 && searchQuery!=="") {
			$(this).val("");
			window.location="https://www.permanentroadtrip.com/DisasterRelief/WebContent/AffectedArea/Area.html?searchQuery="+searchQuery;
	    }
	});
	$("#headerSm-searchBar").keyup(function (e) {
		var searchQuery=$(this).val();
	    if (e.keyCode == 13  && searchQuery!=="") {
			$(this).val("");
		    window.location="https://www.permanentroadtrip.com/DisasterRelief/WebContent/AffectedArea/Area.html?searchQuery="+searchQuery;
	    }
	});
	
//displays textfields that allows user to search through map locations
	var textboxHiddenSm=true;
	$("#headerSm-searchIconHolder").click(function(){
		$("#headerSm-searchBar").val("");
		$("#headerSm-logo").css("display","none");
		
		//switches between displaying the logo or not
		$("#headerSm-searchBarHolder").toggle("slide",{direction: "right" },200,function(){
			if(!textboxHiddenSm){
				$("#headerSm-logo").css("display","inline-block");
				textboxHiddenSm=true;
			}else{
				document.getElementById("headerSm-searchBar").focus();
				textboxHiddenSm=false;
			}
		});
		
		//switches between the remove and search icon
		if(!textboxHiddenSm){	
			$("#headerSm-searchIcon").removeClass("glyphicon-remove");
			$("#headerSm-searchIcon").addClass("glyphicon-search",100);
		}else{	
			$("#headerSm-searchIcon").removeClass("glyphicon-search");
			$("#headerSm-searchIcon").addClass("glyphicon-remove",100);
		}
	});
	
	var textboxHiddenLg=true;
	$("#headerLg-searchIcon").click(function(){
		$("#headerLg-searchBar").val("");
		$("#headerLg-navLg").css("display","none"); 
		//switches between displaying the logo or not
		$("#headerLg-searchBarHolder").toggle("slide",{direction: "right"},200,function(){  
			if(!textboxHiddenLg){
				$("#headerLg-navLg").css("display","inline-block");
				textboxHiddenLg=true;
			}else{
				document.getElementById("headerLg-searchBar").focus();
				textboxHiddenLg=false;
			}
		});
		
		//switches between the remove and search icon
		if(!textboxHiddenLg){	
			$("#headerLg-searchIcon").removeClass("glyphicon-remove");
			$("#headerLg-searchIcon").addClass("glyphicon-search",100);
		}else{	
			$("#headerLg-searchIcon").removeClass("glyphicon-search");
			$("#headerLg-searchIcon").addClass("glyphicon-remove",100);
		}
	});
	
	
	//hides the textbox when the screen gets resized from sm to lg or lg to sm screen size
	$(window).resize(function(){
		//if the navbar is open and the screen size is lg or md
		if(!textboxHiddenSm && $(window).width()>=992){
			$("#headerSm-searchBarHolder").hide();
			
			$("#headerSm-searchIcon").removeClass("glyphicon-remove");
			$("#headerSm-searchIcon").addClass("glyphicon-search");
			
			$("#headerSm-logo").css("display","inline-block");
			textboxHiddenSm=true;
		}
		if(!textboxHiddenLg && $(window).width()<992){
			$("#headerLg-searchBarHolder").hide();
			
			$("#headerLg-searchIcon").removeClass("glyphicon-remove");
			$("#headerLg-searchIcon").addClass("glyphicon-search");
			
			$("#headerLg-navLg").css("display","inline-block");		
			
			textboxHiddenLg=true;
		}
	});


/*sets navbar fixed on scroll*/

    var origOffsetY = 40;

    function scroll(){
        if ($(window).scrollTop()>=origOffsetY) {
            $('#headerLg').addClass('stickyNavbar');
        } else {
            $('#headerLg').removeClass('stickyNavbar');
        }


    }

    document.onscroll = scroll;
    
});


//creates the instagram feed-----------------------------
var userFeed;
function createInstaFeed(){
	var storedInstafeed=sessionStorage.getItem("instafeedHtml");

	if(storedInstafeed===null){
		userFeed = new Instafeed({
				get:'user',
				userId:'7143371073',
				accessToken:'7143371073.9681c27.be63fee4b322423782cada5a21d45623',
				resolution:'standard_resolution',
				limit:6,
				template:
						'<div class="col-lg-2 col-md-2 col-sm-4 col-xs-6 instagramImage">'+
						   	'<a href="{{link}}">'+
								'<span class="img-responsive" style=\' background-image:url("{{image}}") \'></span>'+
							'</a>'+
						'</div>',
				after: function() {
					sessionStorage.setItem("instafeedHtml",$("#instafeed").html());
				}
			});
		userFeed.run();	
	}else{
		$("#instafeed").html(storedInstafeed)
	}

}

$(document).ready(function(){
	/*action listening for the instagram title*/
	$("#footer-instagramHeader").click(function(){
		window.location="https://www.instagram.com/permanentroadtrip/";
	});
	$("#footer-instagramHeader").hover(function(){
		$("#footer-instagram-headerUnderline").toggleClass("footer-instagram-headerUnderline-active");
	});	
});


