var map;
var mapOptions;
var heatmap;
var GraffitiData;
var myLatlng;
var mapData;

window.onload = function() {
  myLatlng = new google.maps.LatLng(40.715845, -73.884675);
  mapOptions = {
    center: myLatlng,
    zoom: 11,
  }
  map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);

  heatmap = new HeatmapOverlay(map, {"radius":30, "visible":true, "opacity":70});

  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/graffiti/geocoded_graffiti",
    success: function(data){
      mapData={
        //max is the abruptness of the gradient
        max: 10,
        data: data
      }
    }
  });

  alert
  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Hello World!'
  });

  google.maps.event.addListener(map, "idle", function() {
    heatmap.setDataSet(mapData);
  });
  
  
  
};


