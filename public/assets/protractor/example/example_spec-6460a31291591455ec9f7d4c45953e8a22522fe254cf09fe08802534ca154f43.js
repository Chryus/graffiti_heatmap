describe("angularjs homepage",function(){it("should greet the named user",function(){browser.get("http://www.angularjs.org"),element(by.model("yourName")).sendKeys("Julie");var e=element(by.binding("yourName"));expect(e.getText()).toEqual("Hello Julie!")}),describe("todo list",function(){var e;beforeEach(function(){browser.get("http://www.angularjs.org"),e=element.all(by.repeater("todo in todoList.todos"))}),it("should list todos",function(){expect(e.count()).toEqual(2),expect(e.get(1).getText()).toEqual("build an angular app")}),it("should add a todo",function(){var t=element(by.model("todoList.todoText")),o=element(by.css('[value="add"]'));t.sendKeys("write a protractor test"),o.click(),expect(e.count()).toEqual(3),expect(e.get(2).getText()).toEqual("write a protractor test")})})});