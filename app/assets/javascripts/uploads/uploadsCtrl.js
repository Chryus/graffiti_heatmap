angular.module('graffitiApp')
  .controller('UploadsCtrl', [
    '$scope',
    '$location',
    '$state',
    'Auth',
    '$auth',
    '$http',
    'users',
    'graffiti',
    function($scope, $location, $state, Auth, $auth, $http, users, graffiti) {
      $scope.currentPath = $location.path();
      $scope.user = users.user;
      $scope.graffito = {};
      $scope.urls = [];

      graffiti.getS3DirectPost().then(function(response) {
        $scope.path = response.data.path;
        $scope.s3_direct_post = response.data.s3_direct_post;
        $scope.s3_direct_post_host = response.data.s3_direct_post_host;
        $scope.options = {
          singleFileUploads: true,
          paramName: 'file', // S3 does not like nested name fields i.e. name="user[avatar_url]"
          dataType: 'XML', // S3 returns XML if success_action_status is set to 201
          type: 'POST',
          url: $scope.s3_direct_post.url,
          formData: $scope.s3_direct_post.fields,
          acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
        }
      }, function(response) {
        console.log("error getting s3 direct post");
      })

      $scope.$on('fileuploaddone', function(e, data) {
        // extract key and generate URL from response for each file
        var key   = $(data.jqXHR.responseXML).find("Key").text();
        var url   = 'https://' + $scope.s3_direct_post_host + '/' + key;
        $scope.urls.push(url);
      });

      $scope.$on('fileuploadstop', function(e, data) {
        // update bindings to grab image data
        $scope.graffito['status'] = "Open";
        $scope.graffito['images'] = $scope.urls;

        $http({
            method: 'POST',
            url: '/upload',
            data: {'graffiti': $scope.graffito},
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .success(function(data) {
            console.log("Graffito created")
          });
        if ((Auth.isAuthenticated() == true || $auth.isAuthenticated() == true)) {
          $state.go('gallery');
        } else {
          $state.go('archive');
        }
        console.log('All uploads have finished');
      });
    }
  ])