angular.module('graffitiApp')
  .factory('graffiti', [
  '$http',
  'Auth',
  function($http, Auth){
    var o = {
       graffiti: [],
       heatmap: []
     };
    //add getList and getGeocded
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
    o.upvote = function(graffito) {
      if (graffito.upvoted == null) {
        return $http.put('/graffiti/' + graffito.id + '/upvote.json').success(function(data) {
          graffito.upvotes += 1;
          graffito['upvoted'] = true;
        });
      }
    };
    o.addComment = function(id, comment) {
      return $http.graffito('/graffiti/' + id + '/comments.json', comment);
    };
    o.upvoteComment = function(graffito, comment) {
      return $http.put('/graffiti/' + graffito.id + '/comments/' + comment.id + '/upvote.json')
        .success(function(data) {
          comment.upvotes += 1;
        });
    };
  return o;
  }]);