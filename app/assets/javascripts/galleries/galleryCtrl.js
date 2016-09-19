angular.module('graffitiApp')
  .controller('GalleryCtrl', [
    '$scope',
    '$location',
    'users',
    'graffiti',
    '$location',
    function($scope, $location, users, graffiti, $location){
      $scope.currentPath = $location.path();
      $scope.user = users.user;
      
      if ($scope.currentPath == '/gallery') {
        $scope.__images = $scope.user.graffiti_images
      } else {
        graffiti.getArchive().then( function ( response ) {
          $scope.__images = response.data;
        }, function (response) {
          alert("error");
        })
      }

      $scope.base_url = "http://graffiti-image-uploads.s3.amazonaws.com"
      $scope.handleClick = function (event) {
        event.preventDefault();
        blueimp.Gallery(
          $('#links a'), $('#blueimp-gallery').data()
        );
      };
  }])