angular.module('graffitiApp')
  .controller('MainCtrl', [
    '$scope',
    '$http',
    '$location',
    'graffiti',
    'map',
    function($scope, $http, $location, graffiti, map){
      $scope.loading = true; // spinner
      $scope.currentPath = $location.path();
      $scope.alert = function () {
        window.alert("Check out the graffito before voting on it.")
      }

      //main data grab
      // if (graffiti.graffiti.length == 0) {
      //   graffiti.getAll().then( function ( response ) {
      //     $scope.graffiti = response.data['graffiti'];
      //     $scope.map = map.getMap('google');
      //   }, function (response) {
      //     alert("error");
      //   }).finally(function() {
      //     // called no matter success or failure
      //     $scope.loading = false;
      //   });
      // } else {
      //   $scope.graffiti = graffiti.graffiti
      //   $scope.loading = false;
      // }

      $scope.matchLat = function (lat) {
        map.matchLat(lat);
      }
    $scope.orderProp = '-upvotes';
  }])