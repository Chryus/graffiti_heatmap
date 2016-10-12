angular.module('graffitiApp')
  .controller('UsersCtrl', [
    '$scope',
    '$location',
    'users',
    'map',
    function($scope, $location, users, map){
      $scope.currentPath = $location.path();
      $scope.user = users.user;
      $scope.graffiti = users.user.graffiti_through_upvotes
      $scope.graffiti_through_uploads = users.user.graffiti_through_uploads
      $scope.getStreetviewPanorama = function (lat) {
        map.getStreetviewPanorama(lat);
      }
      $scope.orderProp = '-upvotes';
  }])