'use strict';

var map;
var markers = [];
var queens = new google.maps.LatLng(40.736871, -73.882369);
var sv = new google.maps.StreetViewService();
var panorama;
var marker;

angular.module('graffitiApp')
  .controller('mainCtrl', [
    '$scope',
    'graffiti',
    '$http',
    function($scope, graffiti, $http){
      $scope.graffiti = graffiti.graffiti
      $scope.incrementUpvotes = function(graffito){
        graffiti.upvote(graffito);
      };
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

      google.maps.event.addListener(map, "dragend", function () {
        heatmap.destroy(); 
        mapOptions["center"] = map.getCenter();
        heatmap.setDataSet(mapData);
      });

//################## map markers ############################################

      $.each(mapData.data, function (i, g) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(g.lat, g.lng),
          map: map,
          zIndex: 100,
          icon: "http://maps.google.com/mapfiles/dir_39.png"
        });
        markers.push(marker);
        clearMarkers();
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
            hide_visibility('button')
            google.maps.event.addListener(panorama, "closeclick", function (event) {
              render_visibility('button')
            });
          });
        })(marker, i);
      });

      // Sets the map on all markers in the array.
      function setAllMap(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      //get latitude of each datum
      $scope.matchLat = function (lat) {
        // alert('hi');
        for (var i = 0; i < markers.length; i++) {
          if (markers[i].position.lat() == lat) {
            console.log(markers[i]);
            panorama = map.getStreetView();
            panorama.setPosition(markers[i].getPosition());
            panorama.setPov({
              heading: 265,
              pitch: 0
            });
            panorama.setVisible(true);
            hide_visibility('button');
            google.maps.event.addListener(panorama, "closeclick", function (event) {
              render_visibility('button')
            });
          }
        }
      }

      function render_visibility(cl) {
        var els = document.getElementsByClassName(cl);
        for (var i = 0; i < els.length; ++i) {
          var s = els[i].style;
          s.display = 'inline';
        }
      }

      function hide_visibility(cl) {
        var els = document.getElementsByClassName(cl);
        for (var i = 0; i < els.length; ++i) {
          var s = els[i].style;
          s.display = 'none';
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

      function toggleMarkers(marker, map) {
        if (marker.getMap() == null)
          setAllMap(map); // marker isn't visible on map, so make it visible
        else
          setAllMap(null); // marker is visible on map, so make it invisible
      }

//################## jQuery ############################################

      $(document).ready(function () {

        var i = 0;

        $('#map-canvas').on("dblclick", function () {
          if (i < 2) {
            clearMarkers();
          } else {
            showMarkers();
          }
          i++;
        });

        $('#markers').on("click", function () {
          toggleMarkers(marker, map);
        });

        $('#heat').on("click", function () {
          heatmap.toggle();
        });

      });
    $scope.orderProp = 'borough';
  }])