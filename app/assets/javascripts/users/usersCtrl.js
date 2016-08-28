angular.module('graffitiApp')
  .controller('UsersCtrl', [
    '$scope',
    'users',
    'map',
    function($scope, users){
      $scope.user = user
      $scope.graffiti = users.user.graffiti
      $scope.matchLat = function (lat) {
        map.matchLat(lat);
      }
      $scope.orderProp = '-upvotes';
  }])