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
      $scope.streetviewOpen = true;

      $scope.goBack = function() {
        $state.go('home', {}, {reload: true});
      }

      $scope.getStreetviewPanorama = function(lat) {
        map.getStreetviewPanorama(lat);
      };

      $scope.saveStreetviewPOV = function(graffito) {
        marker = map.fetchMarker(graffito.latitude);
        graffiti.saveStreetviewPOV(graffito, marker);
      }

      $scope.incrementUpvotes = function(graffito){
        graffiti.upvote(graffito);
        foundIndex = $scope.graffiti.findIndex(x => x.id == graffito.id);
        $scope.graffiti[foundIndex] = graffito;
      };

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
