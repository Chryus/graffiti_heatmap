describe('logging in with Faceboook', function() {
  var originalTimeout;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  
  it('should open sign in pop up', function() {
    browser.get('http://localhost:3000');

    browser.wait(function(){
      return browser.driver.isElementPresent(by.css('.li-token-sign-in'));
    },10000);

    // set nav bar els
    var sign_in_with_facebook = element(by.css('.li-token-sign-in'));
    var favorites = element(by.css('.li-favorites'))
    var basic_login = element(by.css('.li-basic-sign-in'))
    var register = element(by.css('.li-register'))

    // click facebook auth link
    sign_in_with_facebook.click();

    // get all windows
    browser.getAllWindowHandles().then(function(handles){
      // switch to facebook auth popup and fill out form
      browser.switchTo().window(handles[1]).then(function(){
        browser.ignoreSynchronization = true;
        var email = element(by.id('email'))
        var password = element(by.id('pass'))
        var submit = element(by.id('u_0_2'))
        //expect((email).isDisplayed()).toBeTruthy();

        // enter email
        // enter password
        email.sendKeys('youremail');
        password.sendKeys('yourpassword');

        submit.click();
      });
      browser.ignoreSynchronization = false;
      // switch back to app window
      browser.switchTo().window(handles[0]).then(function(){
        // wait until favorites are visible as indicator that user is signed in
        browser.driver.wait(protractor.until.elementIsVisible(favorites));
        expect((sign_in_with_facebook).isDisplayed()).toBeFalsy();
        expect((basic_login).isDisplayed()).toBeFalsy();
        expect((register).isDisplayed()).toBeFalsy();
        expect((favorites).isDisplayed()).toBeTruthy();
       });
    });
  });
});