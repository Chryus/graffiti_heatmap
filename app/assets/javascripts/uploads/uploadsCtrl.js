angular.module('graffitiApp')
  .controller('UploadsCtrl', [
    '$scope',
    '$location',
    'users',
    '$state',
    function($scope, $location, users, $state){
      $scope.currentPath = $location.path();
      $scope.user = users.user;
      $scope.options = {
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
      }
      $scope.$on('fileuploadstop', function(e, data){
        $state.go('favorites');
        console.log('All uploads have finished');
      });
  }])