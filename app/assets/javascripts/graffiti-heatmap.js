var map;
var mapOptions;
var heatmap;
var GraffitiData;

window.onload = function() {
  mapOptions = {
    center: new google.maps.LatLng(40.715845, -73.884675),
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

  google.maps.event.addListener(map, "idle", function() {
    heatmap.setDataSet(mapData);
  });

};


