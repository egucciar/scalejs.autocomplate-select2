/*global define, console*/
define([
    'knockout',
    'jQuery'
], function (
    ko,
    $
) {
    "use strict";

    var // Imports
        isObservable = ko.isObservable;

    function subscribeToSelectedItem(selectedItem, element) {
        if (isObservable(selectedItem)) {
            $(element).on("change", function (o) {
                selectedItem(o.val);
            });
        } else {
            console.error('selectedItem must be an observable');
        }
    }

    function subscribeToUserInput(userInput, element) {
        var container = $(element).select2("container"),
            input = $(container).find(".select2-drop .select2-search .select2-input");

        if (isObservable(userInput)) {
            // Push the user input to the viewmodel
            $(input).on("keyup", function () {
                userInput($(input).val());
            });

            // Make sure that the last user input repopulates the input box when reopened
            $(element).on("select2-open", function () {
                $(input).val(userInput());
            });
        } else {
            console.error('userInput must be an observable');
        }
    }

    return {
        subscribeToSelectedItem: subscribeToSelectedItem,
        subscribeToUserInput: subscribeToUserInput
    };

});