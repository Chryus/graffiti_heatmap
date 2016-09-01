(function(){
  'use strict';

  describe('graffiti', function () {
    beforeEach(module('graffitiApp'));

    // BUG FIX
    // $httpBackend.flush() triggers a broadcast which then triggers the otherwise 
    // case of the stateProvider deferIntercept stops that
    beforeEach(module(function($urlRouterProvider) {
      $urlRouterProvider.deferIntercept();
    }));

    it('returns a JSON object with graffiti items', inject(function ($httpBackend, graffiti) {
      var items;
      $httpBackend.when('GET', '/get_graffiti.json').respond({items: ["item 1", "item 2"]}, {});

      var graffitiList = graffiti.getAll().success(function(response){ items = response.items; });
      expect(items).not.toBeDefined();

      $httpBackend.flush();
      expect(items).toEqual(["item 1", "item 2"]);
    }));

    it('returns a JSON object with one graffiti item', inject(function ($httpBackend, graffiti) {
      var item;
      $httpBackend.expectGET('/graffiti/1.json').respond({item: ["item 1"]}, {});
      
      var graffito = graffiti.get(1).then(function(response){ item = response.item; });
      expect(item).not.toBeDefined();

      $httpBackend.flush();
      expect(item).toEqual(["item 1"]);
    }));

    it('returns a 204 updated status', inject(function ($httpBackend, graffiti) {
      var status;
      $httpBackend.expectPUT('/graffiti/1/upvote.json').respond(204, {});

      var graffito = graffiti.upvote({id: 1}).then(function(response){ status = response.status; });
      expect(status).not.toBeDefined();

      $httpBackend.flush();
      expect(status).toEqual(204);
    }));
  });
})();
