// An example configuration file.
exports.config = {
  directConnect: true,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Framework to use. Jasmine is recommended.
  framework: 'jasmine2',

  allScriptsTimeout: 30000,

  // Spec patterns are relative to the current working directory when
  // protractor is called.
  specs: ['spec/javascripts/e2e/login/facebook_login.js'],

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};