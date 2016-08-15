angular.module('graffitiApp')
  .controller('GraffitiCtrl', [
    '$scope',
    'graffiti',
    'graffito',
    function($scope, graffiti, graffito){
      $scope.graffito = graffito;
      $scope.incrementUpvotes = function(comment){
        graffiti.upvoteComment(graffito, comment);
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