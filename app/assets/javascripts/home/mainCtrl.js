angular.module('graffitiApp')
  .controller('MainCtrl', [
    '$scope',
    '$http',
    'graffiti',
    'map',
    function($scope, $http, graffiti, map){
      $scope.loading = true; // spinner
      $scope.home = true;
      $scope.__title = "Loading heatmap...";
      $scope.alert = function () {
        window.alert("Check out the graffito before voting on it.")
      }
      $scope.base_url = "http://graffiti-image-uploads.s3.amazonaws.com"
      
      graffiti.getArchive().then( function ( response ) {
        $scope.__images = response.data;
      })  

      // wait for images to load and init carousel
      $scope.$watch(function() { return angular.element($('img')).is(':hidden') }, function() {
        gallery = blueimp.Gallery($('#links a'), $('#blueimp-gallery').data());
        gallery.play();
        gallery.options['slideshowInterval'] = 2000
      });

      //main data grab
      if (graffiti.graffiti.length == 0) {
        graffiti.getAll().then( function ( response ) {
          $scope.graffiti = response.data['graffiti'];
          $scope.map = map.getMap('google');
        }, function (response) {
          alert("error");
        }).finally(function() {
          // called no matter success or failure
          $('.close').click();
          $('body').css('overflow', 'visible');
          $scope.loading = false;
        });
      } else {
        $scope.graffiti = graffiti.graffiti
        $scope.loading = false;
      }

      $scope.matchLat = function (lat) {
        map.matchLat(lat);
      }
    $scope.orderProp = '-upvotes';
  }])