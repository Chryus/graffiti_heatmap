(function(){
  'use strict';

  describe('graffiti', function () {
    var $httpBackend, graffiti;

    beforeEach(module('graffitiApp'));

    //BUG FIX
    //$httpBackend.flush() triggers a broadcast which then triggers the 'otherwise' 
    //case of the stateProvider; deferIntercept stops that
    beforeEach(module(function($urlRouterProvider) {
      $urlRouterProvider.deferIntercept();
    }));

    // inject mock http service responses and graffiti service
    beforeEach(inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      graffiti = $injector.get('graffiti');
    }));

    afterEach(function() {
      //Verifies that all of the requests defined via the expect api were made.
      $httpBackend.verifyNoOutstandingExpectation();
      //Verifies that there are no outstanding requests that need to be flushed.
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('returns a JSON object with graffiti items', function() {
      var items;
      $httpBackend.when('GET', '/get_graffiti.json').respond({items: ["item 1", "item 2"]}, {});

      var graffitiList = graffiti.getAll().success(function(response){ items = response.items; });
      expect(items).not.toBeDefined();
      //flush() preserves the async api of the backend, while allowing the test to execute synchronously.
      $httpBackend.flush();
      expect(items).toEqual(["item 1", "item 2"]);
    });

    it('returns a JSON object with one graffiti item', function() {
      var item;
      $httpBackend.expectGET('/graffiti/1.json').respond({item: ["item 1"]}, {});
      
      var graffito = graffiti.get(1).then(function(response){ item = response.item; });
      expect(item).not.toBeDefined();

      $httpBackend.flush();
      expect(item).toEqual(["item 1"]);
    });

    it('returns a 204 updated status', function() {
      var status;
      $httpBackend.expectPUT('/graffiti/1/upvote.json').respond(204, {});

      var graffito = graffiti.upvote({id: 1}).then(function(response){ status = response.status; });
      expect(status).not.toBeDefined();

      $httpBackend.flush();
      expect(status).toEqual(204);
    });
  });
})();
