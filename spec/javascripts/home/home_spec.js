describe('Graffiti list', function() {
  it('should filter results', function() {
    browser.get('http://localhost:3000');
    expect(element.all(by.repeater('graffito in graffiti')).count()).toEqual(2603);
  });
});