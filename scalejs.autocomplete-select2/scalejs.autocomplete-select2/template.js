/*global define, console, document*/
define([
    'knockout',
    'jQuery'
], function (
    ko,
    $
) {
    "use strict";

    var // Imports
        cleanNode = ko.cleanNode,
        applyBindings = ko.applyBindings,
        // Variables
        dummyDiv;

    // Create div to render templates inside to get the html to pass to select2, then hide it
    function createDummyDiv() {
        if (dummyDiv === undefined) {
            dummyDiv = document.createElement('div');
            $(dummyDiv).hide();
            dummyDiv.setAttribute("data-bind", "template: { name: template, data: data }");
        }

        return dummyDiv;
    }

    function createFormatFunction(templateString) {
        return function (d) {

            cleanNode(dummyDiv);

            // Clear Dummy Div html node
            while (dummyDiv.firstChild) {
                dummyDiv.removeChild(dummyDiv.firstChild);
            }

            // render template with (d)
            applyBindings({ template: templateString, data: d.original }, dummyDiv);

            // give rendered data to select2
            return dummyDiv.innerHTML;
        };
    }

    return {
        createDummyDiv: createDummyDiv,
        createFormatFunction: createFormatFunction
    };
});