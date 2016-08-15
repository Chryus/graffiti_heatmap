angular.module('graffitiApp')
  .factory('map', [
  'graffiti',
  function(graffiti){
    var o = {
      maps: {}
    };
    var markers = [];
    var queens = new google.maps.LatLng(40.736871, -73.882369);
    var sv = new google.maps.StreetViewService();
    var panorama;
    var marker;
    //add getList and getGeocded
    o.addMap = function (mapId) {
      var mapData = {
          //max is the abruptness of the gradient
          max: 10,
          data: graffiti.heatmap
        };

  //################## google maps ############################################

      var mapOptions = {
        center: queens,
        zoom: 10,
        streetViewControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        scrollwheel: false,
        draggable: true,
        navigationControl: true,
        mapTypeControl: false,
        scaleControl: true,
        disableDoubleClickZoom: false
      };
      
      map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);

      console.log("MAP INITIALIZED")

  //################## heatmap ############################################

      var heatmap = new HeatmapOverlay(map, {
        "radius": 16,
        "dissipating": false,
        "visible": true,
        "opacity": 80
      });

      var heatLayer = google.maps.event.addListener(map, "idle", function () {
        heatmap.setDataSet(mapData);
      });
      console.log("HEAT DATA SET");
      o.maps[mapId] = {};
      angular.copy(map, o.maps['google']);
    };
    o.getMap = function(mapId) {
      if (!o.maps[mapId]) {
        o.addMap(mapId);
      };
      return o.maps[mapId];
    };
  return o;
  }]);