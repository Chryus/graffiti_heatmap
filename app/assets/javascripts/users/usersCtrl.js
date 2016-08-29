angular.module('graffitiApp')
  .controller('UsersCtrl', [
    '$scope',
    '$location',
    'users',
    'map',
    function($scope, $location, users, map){
      $scope.currentPath = $location.path();
      $scope.user = users.user;
      $scope.graffiti = users.user.graffiti
      $scope.matchLat = function (lat) {
        map.matchLat(lat);
      }
      $scope.orderProp = '-upvotes';
  }])