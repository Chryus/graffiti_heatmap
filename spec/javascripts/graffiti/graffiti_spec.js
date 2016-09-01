(function(){
  'use strict';

  describe('graffiti', function () {
    beforeEach(module('graffitiApp'));

    it('returns a JSON object with graffiti items', inject(function ($httpBackend, graffiti) {
      var items;
      $httpBackend.when('GET', '/get_graffiti.json').respond({items: ["item 1", "item 2"]}, {});

      var graffitiList = graffiti.getAll().success(function(response){ items = response.items; });
      expect(items).not.toBeDefined();

      $httpBackend.flush();
      expect(items).toEqual(["item 1", "item 2"]);
    }));
  });
})();
