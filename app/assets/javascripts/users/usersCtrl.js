angular.module('graffitiApp')
  .controller('UsersCtrl', [
    '$scope',
    'users',
    function($scope, users){
      $scope.user = users.user;
      $scope.graffiti = users.user.graffiti

      $scope.matchLat = function (lat) {
        map.matchLat(lat);
      }
      $scope.orderProp = '-upvotes';
  }])