angular.module('graffitiApp')
  .controller('UploadsCtrl', [
    '$scope',
    '$location',
    '$state',
    'Auth',
    '$auth',
    'users',
    'graffiti',
    function($scope, $location, $state, Auth, $auth, users, graffiti) {
      $scope.currentPath = $location.path();
      $scope.user = users.user;

      graffiti.getS3DirectPost().then( function ( response ) {
        $scope.s3_direct_post = response.data.s3_direct_post;
        $scope.s3_direct_post_host = response.data.s3_direct_post_host;
        $scope.options = {
          paramName: 'file', // S3 does not like nested name fields i.e. name="user[avatar_url]"
          dataType: 'XML',  // S3 returns XML if success_action_status is set to 201
          type: 'POST',
          url: $scope.s3_direct_post.url,
          formData: $scope.s3_direct_post.fields,
          acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
        }
      }, function (response) {
        console.log("error getting s3 direct post");
      })
      
      $scope.$on('fileuploadstop', function(e, data){
        if ((Auth.isAuthenticated() == true || $auth.isAuthenticated() == true)) { 
          $state.go('gallery'); 
        } else {
          $state.go('archive');
        } 
        console.log('All uploads have finished');
      });
  }])