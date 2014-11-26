var toXMLString = function(suite, results) {
	var report = document.implementation.createDocument("", "", null);
	var testsuite = report.createElement("testsuite");
	testsuite.setAttribute("tests", suite.tests.length.toString());
	report.appendChild(testsuite);
	
	_.each(suite.tests, function (test, index) {
		var element = report.createElement("test");
		element.setAttribute("name", test.testName);
		element.setAttribute("result", _.findWhere(results, { name: index.toString() }).value);
		testsuite.appendChild(element);
	})
	
	var serializer = new XMLSerializer();
	return serializer.serializeToString(report);
};

var view = function (){
	var source = "" +
		"<dl>" +
				"{{#tests}}" +
					"<dt>{{testName}}</dt>" +
					"<dd>" +
						"<ol>" +
						"{{#testSteps}}" +
							"<li>{{stepDescription}}</li>" +
						"{{/testSteps}}" +
						"</ol>" +
						"<label for=\"pass-{{@index}}\">Pass</label>" +
						"<input id=\"pass-{{@index}}\" type=\"radio\" name=\"{{@index}}\" value=\"Pass\">" +
						"<label for=\"fail-{{@index}}\">Fail</label>" +
						"<input id=\"fail-{{@index}}\" type=\"radio\" name=\"{{@index}}\" value=\"Fail\">" +
					"</dd>" +
				"{{/tests}}" +
		"</dl>";
	
	return {
		render: function (testsuite) {
			var template = Handlebars.compile(source);
			$('body form').prepend($.parseHTML(template(testsuite)));
		},
		results: function () {
			return $('form').serializeArray();
		},
		displayXUnitReport: function (xUnitReport) {
			$('code').text(xUnitReport);
		},
		handleResultSubmission: function (handler) {
			$("form").submit(handler);	
		}
	};
} 

var controller = function () {
	var testsuite = $.Deferred();
	
	return {
		loadTests: function () {
			$.ajax({ 
				url: 'example-tests/tests.json',
				contentType: 'application/json',
				success: function (response) {
					view().render(response);
					testsuite.resolve(response);
				}
			});
		},
		submitResultsHandler: function(event) {
			event.preventDefault();
			testsuite.done(function (suite) {
				var xUnitReport = toXMLString(suite, view().results());
				view().displayXUnitReport(xUnitReport);				
			});
		}
	};
};

$(document).ready(function () {
	var testController = controller();
	view().handleResultSubmission(testController.submitResultsHandler);
	testController.loadTests();
});