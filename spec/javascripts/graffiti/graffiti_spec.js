(function(){
  'use strict';

  describe('Graffiti', function () {
    beforeEach(module('graffitiApp'));

    it('returns a JSON object with graffiti items', inject(function ($httpBackend, Graffiti) {
      var items;
      $httpBackend.when('GET', '/get_graffiti.json').respond({items: ["item 1", "item 2"]}, {});

      var graffitiList = Graffiti.fetch().success(function(response){ items = response.items; });
      expect(items).not.toBeDefined();

      $httpBackend.flush();
      expect(items).toEqual(["item 1", "item 2"]);
    }));
  });
})();
