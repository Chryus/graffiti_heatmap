angular.module('graffitiApp')
  .controller('MainCtrl', [
    '$scope',
    '$http',
    '$uibModal',
    'graffiti',
    'map',
    function($scope, $http, $uibModal, graffiti, map){
      $scope.loading = true; // spinner
      $scope.home = true;
      $scope.__title = "Loading heatmap...";
      $scope.base_url = "http://graffiti-image-uploads.s3.amazonaws.com"

      //main data grab
      if (graffiti.graffiti.length == 0) {
        graffiti.getAll().then( function ( response ) {
          $scope.graffiti = response.data['graffiti'];
          $scope.map = map.getMap('google');
        }, function (response) {
          alert("error");
        }).finally(function() {
          // close carousel with delay to allow map to render
          $scope.closeCarousel();
        });
      } else {
        $scope.graffiti = graffiti.graffiti
        $scope.loading = false;
      }

      graffiti.getArchive().then( function ( response ) {
        $scope.__images = response.data;
      })  

      // opens street view of clicked graffito
      $scope.matchLat = function (lat) {
        map.matchLat(lat);
      }

       // wait for images to load and init carousel
      $scope.$watch(function() { return angular.element($('img')).is(':hidden') }, function() {
        gallery = blueimp.Gallery($('#links a'), $('#blueimp-gallery').data());
        gallery.play();
        gallery.options['slideshowInterval'] = 2000
      });

      // close carousel with delay to allow map to render
      $scope.closeCarousel = function() {
       setTimeout(function() {
          $('.close').click();
          $('body').css('overflow', 'visible');
          $scope.loading = false;
          // grab UI Element and update its scope to show graffiti list
          // not sure if this is best approach but it's the only one that worked. 
          var element = angular.element($('#graffiti-ui'));
          element.scope().$apply();
       }, 4000);
      };

      // open modal if user tries to upvote before viewing graffito
      $scope.alert = function () {
        var uibModalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          templateUrl: 'home/_modal.html',
          controller: function($uibModalInstance, $scope) {
            $scope.ok = function() {
              $uibModalInstance.close("ok");
            };
          },
          size: 'sm'
        });
      }
    $scope.orderProp = '-upvotes';
  }])