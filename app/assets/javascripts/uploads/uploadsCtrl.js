angular.module('graffitiApp')
  .controller('UploadsCtrl', [
    '$scope',
    '$location',
    'users',
    '$state',
    'Auth',
    '$auth',
    function($scope, $location, users, $state, Auth, $auth){
      $scope.currentPath = $location.path();
      $scope.user = users.user;
      $scope.options = {
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
      }
      $scope.$on('fileuploadstop', function(e, data){
        if ((Auth.isAuthenticated() == true || $auth.isAuthenticated() == true)) { 
          $state.go('gallery'); 
        } else {
          $state.go('archive');
        } 
        console.log('All uploads have finished');
      });
  }])