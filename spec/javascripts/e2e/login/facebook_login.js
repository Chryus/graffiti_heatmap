describe('logging in with Faceboook', function() {

  it('should open pop up and show the facebook login form; it should display the proper nav links after submitting form', function() {
    browser.get('http://localhost:3000');

    browser.wait(function(){
      return browser.driver.isElementPresent(by.css('.li-token-sign-in'));
    },10000);

    // set nav bar els
    var sign_in_with_facebook = element(by.css('.li-token-sign-in'));
    var favorites = element(by.css('.li-favorites'))
    var gallery = element(by.css('.li-gallery'))
    var basic_login = element(by.css('.li-basic-sign-in'))
    var register = element(by.css('.li-register'))
    var logout = element(by.css('.li-logout'))

    // click facebook auth link
    sign_in_with_facebook.click();

    // get all windows
    browser.getAllWindowHandles().then(function(handles){
      // switch to facebook auth popup and fill out form
      browser.switchTo().window(handles[1])
      // tell protractor we're leaving angular
      browser.ignoreSynchronization = true;
        
      var email = element(by.id('email'))
      var password = element(by.id('pass'))
      var submit = element(by.id('u_0_2'))
      
      // check presence of DOM els
      expect(email.isPresent()).toBeTruthy();
      expect(password.isPresent()).toBeTruthy();
      expect(submit.isPresent()).toBeTruthy();

      // enter email
      // enter password
      email.sendKeys('youremail');
      password.sendKeys('yourpassword');

      // use then to make sure click is done processing 
      submit.click().then(function () {
        // this switches focus of protractor back to main angularjs window
        browser.switchTo().window(handles[0]);
        // tell protractor we're going back to angular
        browser.ignoreSynchronization = false;

        // check visibility of nav elements post sign in
        expect((sign_in_with_facebook).isDisplayed()).toBeFalsy();
        expect((basic_login).isDisplayed()).toBeFalsy();
        expect((register).isDisplayed()).toBeFalsy();
        expect((logout).isDisplayed()).toBeTruthy();
        expect((favorites).isDisplayed()).toBeTruthy();
        expect((gallery).isDisplayed()).toBeTruthy();
      });
    });
  });
});