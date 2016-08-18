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
    'map',
    '$http',
    function($scope, graffiti, map, $http){
      $scope.map = map.getMap('google');
      $scope.graffiti = graffiti.graffiti
      $scope.incrementUpvotes = function(graffito){
        graffiti.upvote(graffito);
      };
      $scope.matchLat = function (lat) {
        map.matchLat(lat);
      }
    $scope.orderProp = 'borough';
  }])