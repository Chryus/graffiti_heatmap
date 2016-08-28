angular.module('graffitiApp')
  .factory('users', [
  '$http',
  'Auth',
  function($http, Auth){
    var o = {}
    o.getUser = function() {
      // angular-devise method serves user json per as_json in user.rb
      o['user'] = Auth.currentUser().$$state.value
    };
  return o;
  }]);