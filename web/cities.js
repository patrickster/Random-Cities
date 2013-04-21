

var cities,
    currentIndex = 0,
    currentLocation = '',
    map,
    numCities,
    displayOrder = [],
    maxIndex;

function shuffle(o) { 
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function randomizeDisplayOrder() {
    for (var i = 0; i < numCities; i++) {
	   displayOrder.push(i);
    }
    displayOrder = shuffle(displayOrder);
}


function initializeMap() {
    
    var initCity = cities.cities[displayOrder[0]],
        initLat = initCity.latitude,
        initLng = initCity.longitude,
        initZoom = initCity.zoom;
    
    currentLocation = initCity.city + ', ' + initCity.country;
    
    var mapOptions = {
        center: new google.maps.LatLng(initLat, initLng),
        zoom: initZoom,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
	    mapTypeControl: false,
        keyboardShortcuts: false
    };
    
    map = new google.maps.Map(document.getElementById("map_canvas"),
				  mapOptions);

    $('#center').text('(' + initLat + ', ' + initLng + ')');
    $('#zoom').text(initZoom);
    $('#instructions').css('visibility', 'visible');

    // $('#instructions').addClass('hidden');
    // google.maps.event.addListener(map, 'zoom_changed', function() {
	   // var zoomLevel = map.getZoom();
	   // $('#zoom').text(zoomLevel);
    // });

    // google.maps.event.addListener(map, 'center_changed', function() {
	   // var center = map.getCenter();
	   // $('#center').text(center);
    // });

}


function initialize() {
    $.getJSON('cities.json', function(response) {
	   cities = response;
	   numCities = cities.cities.length;
       maxIndex = numCities - 1;
       console.log(maxIndex);
	   randomizeDisplayOrder(numCities);
	   initializeMap();
    });

    $('#location').hover(function() {
        console.log(currentLocation)
        $(this).html(currentLocation);
    }, function() {
        $(this).html('Where is this?');
    });  

    
}


function changeCity() {
    var currentCity = cities.cities[displayOrder[currentIndex]];
    currentLocation = currentCity.city + ', ' + currentCity.country; 
    var newCenter = new google.maps.LatLng(currentCity.latitude, currentCity.longitude);
    map.setCenter(newCenter);
    map.setZoom(currentCity.zoom);
}


function moveToPreviousCity() {
    if (currentIndex > 0) {
        currentIndex--;
        changeCity();
    }
}


function moveToNextCity() {
    currentIndex++;
    changeCity();
    console.log(currentIndex);
    if (currentIndex == maxIndex) {
	   displayOrder = displayOrder.concat(shuffle(displayOrder.slice(0, numCities)));
       maxIndex += numCities;
    }
}


// $(document).keypress(function(e) {
//     console.log(e.which);
//     switch (e.which) {
//         case 37:
//             moveToPreviousCity();
//             break;
//         case 39:
//             moveToNextCity();
//             break;
//     }
// });

document.onkeydown = function(e) {
    e = e || window.event;
    switch (e.keyCode) {
        case 37:
            moveToPreviousCity();
            break;
        case 39:
            moveToNextCity();
            break;
    }
};


$('#map').ready(function() {     
    $('#instructions').delay(4000).fadeOut(2000, "linear", queue=true);
});



