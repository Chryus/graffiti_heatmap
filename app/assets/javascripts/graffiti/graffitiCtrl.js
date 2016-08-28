angular.module('graffitiApp')
  .controller('GraffitiCtrl', [
    '$scope',
    'graffiti',
    'graffito',
    'map',
    function($scope, graffiti, graffito, map){
      $scope.map = map.getMap('google');
      $scope.graffiti = graffiti.graffiti;
      $scope.graffito = graffito;
      $scope.matchLat = function (lat) {
        map.matchLat(lat);
      }
      $scope.incrementUpvotes = function(graffito){
        graffiti.upvote(graffito);
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