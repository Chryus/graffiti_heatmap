var graffitiServices = angular.module('graffitiServices', ['ngResource']);

graffitiServices.factory('Graffiti', ['$resource',
  function($resource){
    return $resource('http://localhost:3000/api/graffiti.json', {}, {
      query: {method: 'GET', params: {}, isArray:true}
    });
  }]);