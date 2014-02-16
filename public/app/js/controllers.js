'use strict';

var graffitiControllers = angular.module('graffitiControllers', []);
var map;
var markers = [];
var queens = new google.maps.LatLng(40.736871, -73.882369);
var sv = new google.maps.StreetViewService();
var panorama;
var marker;


graffitiApp.controller('GraffitiListCtrl', ['$scope', '$http', 'Graffiti',
    
  function($scope, $http, Graffiti) {
    
    $http.get('graffiti/get_graffiti.json').success(function(data) {
      $scope.graffitis = data;
    });

    $http.get('graffiti/geo_graffiti.json').success(function(data) {
    $scope.geo_graffiti = data;
    var mapData = {
        //max is the abruptness of the gradient
        max: 10,
        data: data
      };

    var mapOptions = {
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

    map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);

    var heatmap = new HeatmapOverlay(map, {
      "radius": 16,
      "dissipating": false,
      "visible": true,
      "opacity": 80
    });

    var heatLayer = google.maps.event.addListener(map, "idle", function () {
        heatmap.setDataSet(mapData);
      });

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
    function matchLat(map, lat) {
      alert(lat);
      for (var i = 0; i < markers.length; i++) {
        if (markers[i].position.d == lat) {
          console.log(markers[i]);
          panorama = map.getStreetView();
          panorama.setPosition(markers[i].getPosition());
          panorama.setPov({
          heading: 265,
          pitch: 0
          });
          panorama.setVisible(true);
        }          
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
      
      // click on address, retrieve latitude
      //search for marker with that latitude
      //open streetview in google map
      $('ul .address').on('click', function(event) {
        alert("wewu");
        var lat = $(this).find('li').eq(2).text().match(/\d{2}.\d+/).pop();
        alert(lat);
        matchLat(map, lat);
      });

      $('#markers').on("click", function() {
        toggleMarkers(marker, map);
      });

      $('#heat').on("click", function() {
        heatmap.toggle();
      });

    });
      
  });
$scope.orderProp = 'incident_address';
}]);











