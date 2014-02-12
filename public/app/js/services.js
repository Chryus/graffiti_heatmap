var graffitiServices = angular.module('graffitiServices', ['ngResource']);

graffitiServices.factory('Graffiti', ['$resource',
  function($resource){
    return $resource('http://localhost:3000/graffiti/geocoded_graffiti', {}, {
      query: {method: 'GET', params: {}, isArray:true}
    });
  }]);