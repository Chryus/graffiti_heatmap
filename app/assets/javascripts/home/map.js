angular.module('graffitiApp')
  .factory('map', [
  'graffiti',
  function(graffiti){
    var o = {
      loading: true,
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
    var markersVisible = false;
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
        scrollwheel: true,
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
        debugger
        heatmap.setData(mapData);
      });
      o.setMapDragEvent(mapId);
      o.fetchMarkers(mapId);
      console.log("HEAT DATA SET");
    };
    o.setMapDragEvent = function (mapId) {
      google.maps.event.addListener(map, "dragend", function () {
        heatmap.destroy();
        mapOptions["center"] = map.getCenter();
        heatmap.setData(mapData);
      });
    };
    o.fetchMarkers = function (mapId) {
      $.each(mapData.data, function (i, graffito) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(graffito.lat, graffito.lng),
          map: map,
          zIndex: 100,
          icon: "http://maps.google.com/mapfiles/dir_39.png",
          pov: graffito.pov
        });
        // add listener for panorama for each marker
        (function (marker, graffito, i) { // inline closure persists value of marker for each iteration
          google.maps.event.addListener(marker, 'click', function () {
            panorama = map.getStreetView();
            panorama.setPosition(marker.getPosition());
            panorama.enableCloseButton = false;
            // use existing POV if it exists
            if (marker['pov']) {
              panorama.setPov({
                heading: parseFloat(marker['pov']['heading']),
                pitch: parseFloat(marker['pov']['pitch']),
              });
            } else {
              panorama.setPov({
                heading: 265,
                pitch: 0
              });
            }
            panorama.setVisible(true);
            // redirect to graffito page
            window.location = "#graffiti/" + graffito.id;
          });
          o.markers.push(marker);
        })(marker, graffito, i);
      });
      o.maps[mapId] = map;
      o.plotMarkers(null);
      o.loading = false;
    };
    o.plotMarkers = function(__map) {
      for (var i = 0; i < o.markers.length; i++) {
        o.markers[i].setMap(__map);
      }
      markersVisible = __map == null ? false : true;
    };
    o.toggleMarkers = function () {
      if (markersVisible == true) {
        o.plotMarkers(null);
        markersVisible = false;
      } else {
        o.plotMarkers(map);
        markersVisible = true;
      }
    };
    o.fetchMarker = function(lat) {
      var marker = null;
      for (var i = 0; i < o.markers.length; i++) {
        if (o.markers[i].position.lat() == lat) {
          marker = o.markers[i];
        }
      }
      return marker;
    };
    o.getStreetviewPanorama = function (lat) {
      marker = o.fetchMarker(lat)
      console.log(marker);
      panorama = map.getStreetView();
      panorama.enableCloseButton = false;
      panorama.setPosition(marker.getPosition());

      // use existing POV if it exists
      if (marker.pov) {
        panorama.setPov({
          heading: parseFloat(marker['pov']['heading']),
          pitch: parseFloat(marker['pov']['pitch'])
        });
      } else {
        panorama.setPov({
          heading: 265,
          pitch: 0
        });
      }
       // set listener to record POV changes and persist in client
      panorama.addListener('pov_changed', function() {
        console.log("Inside Listener")
        console.log(marker);
        marker['pov'] = {};
        marker['pov']['heading'] = panorama.getPov().heading + '';
        marker['pov']['pitch'] = panorama.getPov().pitch + '';
        console.log(marker);
      });
      panorama.setVisible(true);
    };
    o.getMap = function(mapId) {
      if (!o.maps[mapId]) {
        o.addMap(mapId);
      }
      return o.maps[mapId];
    };

    //### jQuery

    $(document).ready(function () {

      var i = 0;

      $('#map-canvas').on("dblclick", function () {
        if (i < 1) {
          o.plotMarkers(null);
          markersVisible = false;
        } else {
          o.plotMarkers(map);
          markersVisible = true;
        }
        i++;
      });

      $(document).on('click', '#markers', function() {
        o.toggleMarkers();
      });

      $(document).on('click', '#heat', function() {
        heatmap.toggle();
      });
    });
  return o;
  }]);
