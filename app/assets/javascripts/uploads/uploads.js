angular.module('graffitiApp')
  .factory('uploads', [
  '$http',
  function($http){
    var o = {
       uploaded: false
    };
    o.getS3DirectPost = function() {
      return $http.get('/graffiti/s3_direct_post.json').success(function(data){
        return data;
      });
    };
    o.setUploaded = function() {
      o.uploaded = true;
    };
  return o;
  }]);