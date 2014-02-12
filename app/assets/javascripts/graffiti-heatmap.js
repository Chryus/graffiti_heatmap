var map, heatLayer, bikeLayer;
var markers = [];

window.onload = function () {
  myLatlng = new google.maps.LatLng(40.715845, -73.884675);
  mapOptions = {
    center: myLatlng,
    zoom: 11,
    streetViewControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL

    }
  };

  map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);

  heatmap = new HeatmapOverlay(map, {
    "radius": 30,
    "dissipating": false,
    "visible": true,
    "opacity": 90
  });

  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/graffiti/geocoded_graffiti",
    success: function (data) {
      mapData = {
        //max is the abruptness of the gradient
        max: 10,
        data: data
      };
      var heatLayer = google.maps.event.addListener(map, "idle", function () {
        heatmap.setDataSet(mapData);
      });
      var bikeLayer = new google.maps.BicyclingLayer();
      bikeLayer.setMap(map);
      $.each(mapData.data, function (i, g) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(g.lat, g.lng),
          map: map,
          zIndex: 100
        });
        markers.push(marker);
        clearMarkers();
      });
    }
  });
};


// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setAllMap(map);
}


$(document).ready(function () {

  var i = 0;
  $('#map-canvas').on("dblclick", function () {
    console.log("markers");
    if (i < 1) {
      clearMarkers();
    } else {
      showMarkers();
    }
    i++;
  });

});