angular.module('graffitiApp')
  .factory('graffiti', [
  '$http',
  'Auth',
  function($http, Auth){
    var o = {
       graffiti: [],
       heatmap: [],
       archive: []
     };
    o.getAll = function() {
      return $http.get('/get_graffiti.json').success(function(data){
        angular.copy(data.graffiti, o.graffiti);
        angular.copy(data.heatmap, o.heatmap);
      });
    };
    o.get = function(id) {
      return $http.get('/graffiti/' + id + '.json').then(function(res) {
        return res.data;
      });
    };
    o.getArchive = function() {
      return $http.get('/graffiti/archive.json').success(function(data){
        angular.copy(data.graffiti_archive, o.graffiti_archive);
      });
    };
    o.upvote = function(graffito) {
      if (graffito.upvoted == null) {
        return $http.put('/graffiti/' + graffito.id + '/upvote.json').success(function(data) {
          graffito.upvotes += 1;
          graffito['upvoted'] = true;
        });
      }
    };
    o.removeImage = function(filename) {
      return $http({
        method: 'PUT',
        url: '/graffiti/delete_image.json',
        data: {'filename': filename}
      })
      .then(function(res) {
        return res.data
      });
    };
    // o.addComment = function(id, comment) {
    //   return $http.graffito('/graffiti/' + id + '/comments.json', comment);
    // };
    // o.upvoteComment = function(graffito, comment) {
    //   return $http.put('/graffiti/' + graffito.id + '/comments/' + comment.id + '/upvote.json')
    //     .success(function(data) {
    //       comment.upvotes += 1;
    //     });
    // };
  return o;
  }]);