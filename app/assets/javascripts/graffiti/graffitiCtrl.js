angular.module('graffitiApp')
  .controller('GraffitiCtrl', [
    '$scope',
    '$state',
    'graffiti',
    'graffito',
    'map',
    function($scope, $state, graffiti, graffito, map){
      $scope.map = map.getMap('google');
      $scope.graffiti = graffiti.graffiti;
      $scope.graffito = graffito;

      $scope.getStreetviewPanorama = function (lat) {
        map.getStreetviewPanorama(lat);
      };

      $scope.saveStreetviewPOV = function(id, lat) {
        marker = map.fetchMarker(lat);
        graffiti.saveStreetviewPOV(id, marker);
      }

      $scope.incrementUpvotes = function(graffito){
        graffiti.upvote(graffito);
      };

      $scope.goHome = function() {
        $state.go('home');
      }

      $scope.addComment = function(){
        if($scope.body === '') { return; }
        graffiti.addComment(graffito.id, {
          body: $scope.body,
          author: 'user'}).success(function(comment) {
            $scope.graffito.comments.push(comment);
          })
        $scope.body = '';
      };
  }])