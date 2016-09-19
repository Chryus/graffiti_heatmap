angular.module('graffitiApp')
  .controller('GalleryCtrl', [
    '$scope',
    '$location',
    'users',
    function($scope, $location, users){
      $scope.currentPath = $location.path();
      $scope.user = users.user;
      $scope.__images = $scope.user.graffiti_through_uploads;
      $scope.base_url = "http://graffiti-image-uploads.s3.amazonaws.com"
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