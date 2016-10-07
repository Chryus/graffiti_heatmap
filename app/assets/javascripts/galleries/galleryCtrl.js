angular.module('graffitiApp')
  .controller('GalleryCtrl', [
    '$scope',
    '$location',
    'users',
    'graffiti',
    '$location',
    '$uibModal',
    '$log',
    function($scope, $location, users, graffiti, $location, $uibModal, $log){
      $scope.base_url = "http://graffiti-image-uploads.s3.amazonaws.com"
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

      // remove image and open modal
      $scope.removeImage = function (filename, thumbnail_link) {
        debugger
        event.stopPropagation(); // stop click from bubbling up to bootstrap image carousel
        event.preventDefault(); // stop click from opening image
        var uibModalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'galleries/_modal_content.html',
          controller:function($uibModalInstance, $scope){
            $scope.base_url = "http://graffiti-image-uploads.s3.amazonaws.com"
            $scope.__filename = filename.slice(-15);
            $scope.thumbnail_link = $scope.base_url + '/' + thumbnail_link
            $scope.ok = function () {
              $uibModalInstance.close("ok");
            };
            $scope.cancel = function () {
              $uibModalInstance.dismiss('cancel');
            };
          },
          size: 'sm'
        });
        uibModalInstance.result.then(function (selectedItem) {
          if(selectedItem === 'ok') {
            graffiti.removeImage(filename).then( function ( response ) {
              console.log(response);
              console.log("deleting item " + filename);
              // refresh current user's images
              users.getUser().then( function ( response ) {
                $scope.__images = response.graffiti_images
              })
            }, function (response) {
              console.log("Error removing image");
            })
          }
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
  }])