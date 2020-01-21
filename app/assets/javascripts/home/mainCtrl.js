angular.module('graffitiApp')
  .controller('MainCtrl', [
    '$scope',
    '$http',
    '$uibModal',
    'graffiti',
    'map',
    function($scope, $http, $uibModal, graffiti, map){
      $scope.delaying = true;
      $scope.home = true;
      $scope.__title = "Loading heatmap...";
      $scope.base_url = "http://graffiti-image-uploads.s3.amazonaws.com"

      // set images for carousel
      graffiti.getArchive().then( function ( response ) {
        $scope.__images = response.data;
      });

      //main data grab
      if (graffiti.graffiti.length == 0) {
        graffiti.getAll().then( function ( response ) {
          $scope.graffiti = response.data['graffiti'];
          $scope.map = map.getMap('google');
        }, function (response) {
          alert("error");
        }).finally(function() {
          // close carousel with delay to allow map to render
          $scope.closeCarousel(4000);
        });
      } else {
        $scope.graffiti = graffiti.graffiti;
        $scope.delaying = false;
      }

      // opens street view of clicked graffito
      $scope.getStreetviewPanorama = function (lat) {
        map.getStreetviewPanorama(lat);
      }

      // show single marker on mouseover
      $scope.showMarker = function (lat) {
        map.fetchMarker(lat, true);
      };

      // hide single marker on mouseleave
      $scope.hideMarker = function (lat) {
        map.fetchMarker(lat, false);
      };

      // wait for images to load and init carousel
      $scope.$watch(function() { return angular.element($('img')).is(':hidden') }, function() {
        gallery = blueimp.Gallery($('#links a'), $('#blueimp-gallery').data());
        gallery.play();
        gallery.options['slideshowInterval'] = 2000
      });

      // close carousel with delay to allow map to render
      $scope.closeCarousel = function(delay) {
       setTimeout(function() {
          $('.close').click();
          angular.element('body').css('overflow', 'visible');
          $scope.delaying = false;
          // grab UI Element and update its scope to show graffiti list
          // not sure if this is best approach but it's the only one that worked.
          var element = angular.element($('#graffiti-ui'));
          element.scope().$apply();
       }, delay);
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

     // temporary hack to fix no spaces bug in text fields
    angular.element("input").on( "keyup", function() {
       if(event.keyCode == 32){
        $(this).val($(this).val()+' ');
      }
    });

    $scope.orderProp = '-upvotes';
  }])
