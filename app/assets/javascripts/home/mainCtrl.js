angular.module('graffitiApp')
  .controller('MainCtrl', [
    '$scope',
    '$http',
    '$location',
    'graffiti',
    'map',
    function($scope, $http, $location, graffiti, map){
      $scope.currentPath = $location.path();
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