angular.module('graffitiApp')
  .controller('MainCtrl', [
    '$scope',
    '$http',
    '$location',
    'graffiti',
    'map',
    function($scope, $http, $location, graffiti, map){
      $scope.loading = true; // spinner
      $scope.currentPath = $location.path();
      $scope.alert = function () {
        window.alert("Check out the graffito before voting on it.")
      }
      $scope.base_url = "http://graffiti-image-uploads.s3.amazonaws.com"
      
      graffiti.getArchive().then( function ( response ) {
        $scope.__images = response.data;
         $scope.$broadcast("imageLoaded");
      }, function (response) {
        alert("error");
      })

      // open carousel when doc is ready
      $scope.$on("imageLoaded", function(){
        setTimeout(function(){
          $('img')[0].click()
          $('.play-pause')[0].click()
        }, 500);
      })

      $scope.handleClick = function (event) {
        event.preventDefault();
        blueimp.Gallery(
          $('#links a'),
          {
            slideshowInterval: 500
          }
        );
      };

      //main data grab
      if (graffiti.graffiti.length == 0) {
        graffiti.getAll().then( function ( response ) {
          $scope.graffiti = response.data['graffiti'];
          $scope.map = map.getMap('google');
        }, function (response) {
          alert("error");
        }).finally(function() {
          // called no matter success or failure
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