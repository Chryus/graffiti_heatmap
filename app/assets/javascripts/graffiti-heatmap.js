var map;
var mapOptions;
var heatmap;
var GraffitiData;

window.onload = function() {
  mapOptions = {
    center: new google.maps.LatLng(40.714623, -74.006605),
    zoom: 11,
  }
  map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);

  heatmap = new HeatmapOverlay(map, {"radius":40, "visible":true, "opacity":90});

  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/graffiti/geocoded_graffiti",
    success: function(data){
      mapData={
        //max is the abruptness of the gradient
        max: 12,
        data: data
      };
    }
  });

  google.maps.event.addListener(map, "idle", function() {
    heatmap.setDataSet(mapData);
  })
};


