angular.module('graffitiApp')
  .controller('UsersCtrl', [
    '$scope',
    'map',
    'Auth',
    function($scope, map, Auth){
      Auth.currentUser().then(function(user) {
        $scope.user = user;
        $scope.graffiti = user.graffiti
      })
      debugger
      $scope.matchLat = function (lat) {
        map.matchLat(lat);
      }
      $scope.orderProp = '-upvotes';
  }])