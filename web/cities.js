
var cities,
  currentIndex = 0,
  currentLocation = '',
  map,
  numCities,
  displayOrder = [],
  maxIndex;


function shuffle(v) { 
  // shuffle function by Jonas Raoni Soares Silva (http://jsfromhell.com/array/shuffle)
  for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
  return v;
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
  
  currentLocation = initCity.city;
  
  var mapOptions = {
    center: new google.maps.LatLng(initLat, initLng),
    zoom: initZoom,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
	  mapTypeControl: false,
    keyboardShortcuts: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false
  };
  
  map = new google.maps.Map(document.getElementById('map-canvas'),
				  mapOptions);

  $('#center').text('(' + initLat + ', ' + initLng + ')');
  $('#zoom').text(initZoom);
  $('#instructions').css('visibility', 'visible');

  // google.maps.event.addListener(map, 'zoom_changed', function() {
	 //   var zoomLevel = map.getZoom();
	 //   $('#zoom').text(zoomLevel);
  // });

  // google.maps.event.addListener(map, 'center_changed', function() {
	 //   var center = map.getCenter();
	 //   $('#center').text(center);
  // });

}


function initialize() {

  $.getJSON('cities.json', function(response) {
	  cities = response;
	  numCities = cities.cities.length;
    maxIndex = numCities - 1;
    randomizeDisplayOrder(numCities);
	  initializeMap();
  });

  $('#location').hover(function() {
    $(this).html(currentLocation);
  }, function() {
    $(this).html('Where is this?');
  });  

  // Arrow key interactions
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
}


function changeCity() {
  var currentCity = cities.cities[displayOrder[currentIndex]];
  currentLocation = currentCity.city;
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


$(window).load(function () {
  initialize();
});


// Fade out instructions div after map is loaded
$('#map').ready(function() {   
  $('#instructions').delay(4000).fadeOut(2000, 'linear', queue=true);
});


