angular.module('graffitiApp')
  .controller('UploadsCtrl', [
    '$scope',
    '$location',
    'users',
    function($scope, $location, users){
      $scope.currentPath = $location.path();
      $scope.user = users.user;
      $scope.options = {
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        formAcceptCharset: 'utf-8'
      }
  }])