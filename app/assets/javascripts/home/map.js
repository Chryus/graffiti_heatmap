angular.module('graffitiApp')
  .factory('map', [
  'graffiti',
  function(graffiti){
    var o = {
      maps: {},
      markers: []
    };
    var map = null;
    var heatmap = {};
    var mapOptions = {};
    var mapData = {};
    //var markers = [];
    var queens = new google.maps.LatLng(40.736871, -73.882369);
    var sv = new google.maps.StreetViewService();
    var panorama;
    var marker;
    //add getList and getGeocded
    o.addMap = function (mapId) {
      mapOptions = {
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

      map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
      o.heatMap(mapId);
    };
    o.heatMap = function (mapId) {
      mapData = {
        //max is the abruptness of the gradient
        max: 10,
        data: graffiti.heatmap
      };

      heatmap = new HeatmapOverlay(map, {
        "radius": 16,
        "dissipating": false,
        "visible": true,
        "opacity": 80
      });

      google.maps.event.addListener(map, "idle", function () {
        heatmap.setDataSet(mapData);
      });
      o.setMapDragEvent(mapId);
      o.fetchMarkers(mapId);
      console.log("HEAT DATA SET");
    };
    o.setMapDragEvent = function (mapId) {
      google.maps.event.addListener(map, "dragend", function () {
        heatmap.destroy(); 
        mapOptions["center"] = map.getCenter();
        heatmap.setDataSet(mapData);
      });
    };
    o.fetchMarkers = function (mapId) {
      $.each(mapData.data, function (i, g) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(g.lat, g.lng),
          map: map,
          zIndex: 100,
          icon: "http://maps.google.com/mapfiles/dir_39.png"
        });
        (function (marker, i) {
          // add click event
          google.maps.event.addListener(marker, 'click', function () {
            panorama = map.getStreetView();
            panorama.setPosition(marker.getPosition());
            panorama.setPov({
              heading: 265,
              pitch: 0
            });
            panorama.setVisible(true);
            o.hide_visibility('button')
            google.maps.event.addListener(panorama, "closeclick", function (event) {
              o.render_visibility('button')
            });
          });
          o.markers.push(marker);
        })(marker, i);
      });
      o.maps[mapId] = map;
      o.plotMarkers(null);
    };
    o.plotMarkers = function(__map) {
      for (var i = 0; i < o.markers.length; i++) {
        o.markers[i].setMap(__map);
      }
    };
    o.toggleMarkers = function (marker) {
      if (marker.getMap() == null)
        o.plotMarkers(map); // marker isn't visible on map, so make it visible
      else
        o.plotMarkers(null); // marker is visible on map, so make it invisible
    }
    o.matchLat = function (lat) {
      for (var i = 0; i < o.markers.length; i++) {
        if (o.markers[i].position.lat() == lat) {
          console.log(o.markers[i]);
          panorama = map.getStreetView();
          panorama.setPosition(o.markers[i].getPosition());
          panorama.setPov({
            heading: 265,
            pitch: 0
          });
          panorama.setVisible(true);
          o.hide_visibility('button');
          google.maps.event.addListener(panorama, "closeclick", function (event) {
            o.render_visibility('button')
          });
        }
      }
    };
    o.render_visibility = function (cl) {
      els = document.getElementsByClassName(cl);
      for (var i = 0; i < els.length; ++i) {
        var s = els[i].style;
        s.display = 'inline';
      }
    }
    o.hide_visibility = function (cl) {
      els = document.getElementsByClassName(cl);
      for (var i = 0; i < els.length; ++i) {
        var s = els[i].style;
        s.display = 'none';
      }
    }
    o.getMap = function(mapId) {
      if (!o.maps[mapId]) {
        o.addMap(mapId);
      }
      return o.maps[mapId];
    };

    //################## jQuery ############################################

    $(document).ready(function () {

      var i = 0;

      $('#map-canvas').on("dblclick", function () {
        if (i < 1) {
          o.plotMarkers(null);
        } else {
          o.plotMarkers(map);
        }
        i++;
      });

      $('#markers').on("click", function () {
        o.toggleMarkers(marker);
      });

      $('#heat').on("click", function () {
        heatmap.toggle();
      });

    });
  return o;
  }]);

