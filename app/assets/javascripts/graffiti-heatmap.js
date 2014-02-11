var map;
var mapOptions;
var heatmap;
var GraffitiData;

window.onload = function() {
  mapOptions = {
    center: new google.maps.LatLng(40.714623, -74.006605),
    zoom: 8,
  }
  map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);

  heatmap = new HeatmapOverlay(map, {"radius":10, "visible":true, "opacity":60});

  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/graffiti/geocoded_graffiti"
    success: function(data){
      mapData={
        max: 46
        data: data
      };
    }
  });

  google.maps.event.addListener(map, "idle", function() {
    heatmap.setDataSet(mapData);
  })
};


