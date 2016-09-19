angular.module('graffitiApp')
  .controller('GalleryCtrl', [
    '$scope',
    '$location',
    'users',
    function($scope, $location, users){
      $scope.currentPath = $location.path();
      $scope.user = users.user;
      $scope.__images = $scope.user.graffiti_images;
      $scope.base_url = "http://graffiti-image-uploads.s3.amazonaws.com"
      $scope.handleClick = function (event) {
        event.preventDefault();
        blueimp.Gallery(
          $('#links a'), $('#blueimp-gallery').data()
        );
      };
  }])