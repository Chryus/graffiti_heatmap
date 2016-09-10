describe('logging in with Faceboook', function() {
  it('should show the username in the nav bar after sign in', function() {

    browser.get('http://localhost:3000');

    browser.wait(function(){
      return browser.driver.isElementPresent(by.css(".graffitis"));
    },30000);

    var sign_in_with_facebook = element(by.css('.li-token-sign-in'));
    var favorites = element(by.css('.li-favorites'))
    var basic_login = element(by.css('.li-basic-login'))
    var register = element(by.css('.li-register'))

    sign_in_with_facebook.click();

    expect(sign_in_with_facebook).isDisplayed().toBeFalsy();
    expect(basic_login).isDisplayed().toBeFalsy();
    expect(register).isDisplayed().toBeFalsy();
    expect(favorites).isDisplayed().toBeTruthy();
  });
});