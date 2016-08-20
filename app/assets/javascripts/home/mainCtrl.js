'use strict';

var map;
var markers = [];
var queens = new google.maps.LatLng(40.736871, -73.882369);
var sv = new google.maps.StreetViewService();
var panorama;
var marker;

angular.module('graffitiApp')
  .controller('MainCtrl', [
    '$scope',
    'graffiti',
    'map',
    '$http',
    function($scope, graffiti, map, $http){
      $scope.map = map.getMap('google');
      $scope.alert = function () {
        window.alert("Check out the graffito before voting on it.")
      }
      $scope.graffiti = graffiti.graffiti
      $scope.matchLat = function (lat) {
        map.matchLat(lat);
      }
    $scope.orderProp = '-upvotes';
  }])