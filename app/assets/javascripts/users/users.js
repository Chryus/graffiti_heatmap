angular.module('graffitiApp')
  .factory('users', [
  '$http',
  'Auth',
  function($http, Auth){
    var o = {
       user: {}
    };
    o.getUser = function(id) {
      return Auth.currentUser().then(function (user){
        return $http.get('/users/' + user.id + '.json').success(function(data){
          angular.copy(data, o.user);
        });
      });
    };
  return o;
  }]);