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
      $scope.home = false;
      $scope.__title = "";
      
      if ($scope.currentPath == '/gallery') {
        $scope.__images = $scope.user.graffiti_images
      } else {
        graffiti.getArchive().then( function ( response ) {
          $scope.__images = response.data;
        }, function (response) {
          console.log("error");
        })
      }

      $scope.remove = function (filename) {
        event.stopPropagation(); // stop click from bubbling up to bootstrap image carousel
        event.preventDefault(); // stop click from opening image
        alert("Are you sure you want to delete this image?")
        graffiti.removeImage(filename).then( function ( response ) {
           console.log(response);
           $scope.__images = $scope.user.graffiti_images;
        }, function (response) {
          console.log("Error removing image");
        })
      }

      $scope.base_url = "http://graffiti-image-uploads.s3.amazonaws.com"
  }])