angular.module('graffitiApp')
  .controller('GalleryCtrl', [
    '$scope',
    '$location',
    'users',
    function($scope, $location, users){
      $scope.currentPath = $location.path();
      $scope.user = users.user;
      $scope.handleClick = function (event) {
        event.preventDefault();
        blueimp.Gallery(
          document.getElementById('links').getElementsByTagName('a'),
          {
            container: '#blueimp-gallery',
            carousel: true
          }
        );
      };
  }])