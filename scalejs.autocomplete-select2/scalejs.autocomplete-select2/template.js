/*global define, console*/
define([
], function (
) {
    "use strict";

    var dummyDiv;

    // Create div to render templates inside to get the html to pass to select2, then hide it
    function createDummyDiv() {
        if (dummyDiv === undefined) {
            dummyDiv = document.createElement('div');
            $(dummyDiv).hide();
            dummyDiv.setAttribute("data-bind", "template: { name: template, data: data }");
        }

        return dummyDiv;
    }

    return {
        createDummyDiv: createDummyDiv
    }
});