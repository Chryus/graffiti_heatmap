describe('logging in with Faceboook', function() {
  it('should show the username in the nav bar after sign in', function() {

    browser.get('http://localhost:3000');

    // set nav bar els
    var sign_in_with_facebook = element(by.css('.li-token-sign-in'));
    var favorites = element(by.css('.li-favorites'))
    var basic_login = element(by.css('.li-basic-sign-in'))
    var register = element(by.css('.li-register'))

    // click facebook auth link
    sign_in_with_facebook.click();

    // switch to facebook auth popup and fill out form
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[1]).then(function(){
        var email = element(by.css('input[type=email]'))
        var password = element(by.css('input[type=password]'))
        var submit = element(by.css('input[type=submit]'))
        browser.pause();

        // enter email
        // enter password
        email.sendKeys('youremail');
        password.sendKeys('yourpassword');

        submit.click();
      });
    });
    
    // switch back to parent and test nav bar 
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[0]).then(function(){
        expect((sign_in_with_facebook).isDisplayed()).toBeFalsy();
        expect((basic_login).isDisplayed()).toBeFalsy();
        expect((register).isDisplayed()).toBeFalsy();
        expect((favorites).isDisplayed()).toBeTruthy();
      });
    });
  });
});