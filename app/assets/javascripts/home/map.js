angular.module('graffitiApp')
  .factory('map', [
  'graffiti',
  function(graffiti){
    var o = {
      loading: true,
      showMarkers: false,
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
        "radius": 18,
        "dissipating": false,
        "visible": true,
        "opacity": 0.85
      });

      google.maps.event.addListener(map, "idle", function () {
        heatmap.setData(mapData);
      });
      o.fetchMarkers(mapId);
      console.log("HEAT DATA SET");
    };
    o.fetchMarkers = function (mapId) {
      $.each(mapData.data, function (i, graffito) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(graffito.lat, graffito.lng),
          map: map,
          zIndex: 100,
          icon: "http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_orange.png",
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
      o.showMarkers = __map == null ? false : true;
    };
    o.plotMarker = function(marker, __map) {
      marker.setMap(__map);
      marker.setVisible(true);
    };
    o.hideMarker = function(marker) {
      marker.setVisible(false);
    };
    o.toggleMarkers = function () {
      if (o.showMarkers == true) {
        o.plotMarkers(null);
        o.showMarkers = false;
      } else {
        o.plotMarkers(map);
        o.showMarkers = true;
      }
    };
    o.fetchMarker = function(lat, option) {
      var marker = null;
      for (var i = 0; i < o.markers.length; i++) {
        if (o.markers[i].position.lat() == lat) {
          marker = o.markers[i];
        }
      }
      if (option) {
        o.plotMarker(marker, map);
      } else {
        o.hideMarker(marker, map);
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
        marker['pov'] = {};
        marker['pov']['heading'] = panorama.getPov().heading + '';
        marker['pov']['pitch'] = panorama.getPov().pitch + '';
        foundIndex = o.markers.findIndex(x => x.position.lat() == marker.position.lat());
        o.markers[foundIndex] = marker;
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
          o.showMarkers = false;
        } else {
          o.plotMarkers(map);
          o.showMarkers = true;
        }
        i++;
      });
    });
  return o;
  }]);
