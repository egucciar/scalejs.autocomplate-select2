define([
    'scalejs!core',
    'knockout',
    'jQuery',
    'select2',
    'scalejs.mvvm'
], function (
    core,
    ko,
    $
) {
    "use strict";

    var // Imports
        observable = ko.observable,
        computed = ko.computed,
        unwrap = ko.unwrap,
        isObservable = ko.isObservable,
        merge = core.object.merge;

    function init (element, valueAccessor, allBindingsAccessor, viewModel) {

        var // Scope variables
            value = valueAccessor(),
            select2 = value.select2,
            container,
            input,
            // Temporary variables
            queryFunction,
            data;


        // ----Set up object to pass to select2 with all it's configuration properties----
        if ( select2 === undefined) {
            select2 = {};
        } 
        // If they passed itemsToShow, display all of them, else let select2 handle the search
        if (value.itemsToShow) {
            select2.query = function (query) {
                queryFunction = computed(function () {
                    data = {
                        results: []
                    }
                    value.itemsToShow().forEach(function (d) {
                        data.results.push(d);
                    });
                    query.callback(data);
                });
            }
        } else {
            select2.data = value.data();
        }
        $(element).select2(select2);

        // Make sure knockout updates correctly
        $(element).on("change", function (o) {
            value.selectedItem(o.val)
        });

        // ----Handle the user text input----

        container = $(element).select2("container");
        input = $(container).find(".select2-drop .select2-search .select2-input");

        // Push the user input to the viewmodel
        $(input).on("keyup", function (o) {
            value.userInput($(input).val());
        });

        // Make sure that the last user input repopulates the input box when reopened
        $(element).on("select2-open", function (o) {
            $(input).val(value.userInput());
        });

        // ----Set up the disposal of select2----
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).select2('destroy');
        });

    }

    function update (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor();
    }

    return {
        init: init
    };
});