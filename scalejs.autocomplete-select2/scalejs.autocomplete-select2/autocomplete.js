/*global define, console, document*/
define([
    'scalejs!core',
    'knockout',
    'formatter',
    'template',
    'subscribe',
    'jQuery',
    'select2',
    'scalejs.mvvm'
], function (
    core,
    ko,
    formatter,
    template,
    subscribe,
    $
) {
    "use strict";

    var // Imports
        computed = ko.computed,
        isObservable = ko.isObservable,
        is = core.type.is,
        mapItems = formatter.mapItems,
        createDummyDiv = template.createDummyDiv,
        createFormatFunction = template.createFormatFunction,
        subscribeToSelectedItem = subscribe.subscribeToSelectedItem,
        subscribeToUserInput = subscribe.subscribeToUserInput;

    function initializeSelect2(element, valueAccessor) {

        var // Scope variables
            value = valueAccessor(),
            select2 = value.select2,
            container,
            input,
            // Important Values from accessor
            itemsSource =           value.itemsSource,
            itemTemplate =          value.itemTemplate,
            selectedItemTemplate =  value.selectedItemTemplate,
            idpath =                value.idPath,
            textpath =              value.textPath,
            childpath =             value.childPath,
            userInput =             value.queryText,
            selectedItem =          value.selectedItem,
            selectGroupNodes =      value.selectGroupNodes,
            customFiltering =       value.customFiltering,
            // Temporary variables
            data,
            queryComputed;

        // ----Set up object to pass to select2 with all it's configuration properties----
        if (select2 === undefined || select2 === null) {
            select2 = {};
        }

        // If customFiltering is enabled, display all of them, else let select2 handle the search
        if (customFiltering) {
            select2.query = function (query) {
                if (queryComputed) {
                    queryComputed.dispose();
                }
                queryComputed = computed(function () {
                    data = { results: mapItems(itemsSource(), idpath, textpath, childpath, selectGroupNodes) };
                    if (!is(data.results, 'array')) {
                        console.warn('itemsToShow must return an array');
                        data.results = [];
                    }
                    query.callback(data);
                });
            };
        } else {
            if (isObservable(itemsSource)) {
                // Select2 will execute a function passed as a data paramater, and this is the best way to push data through an observable to select2
                select2.data = function () {
                    var results = mapItems(itemsSource(), idpath, textpath, childpath, selectGroupNodes);
                    return { results: results }; // this has to be an object due to this being an undocumented select2 feature
                };
            } else if (itemsSource) {// its just a plain array
                select2.data = mapItems(itemsSource, idpath, textpath, childpath, selectGroupNodes);
            }
        }

        // ----handle templating----
        if (itemTemplate) {

            // Create div to render templates inside to get the html to pass to select2, then hide it
            createDummyDiv();

            // Make select2 apply this template to all items
            select2.formatResult = createFormatFunction(itemTemplate);
            select2.formatSelection = select2.formatResult;

            // If the user gave a more specific template for seletcted item, use that instead
            if (selectedItemTemplate) {
                select2.formatSelection = createFormatFunction(selectedItemTemplate);
            }
            // This function is run on the data, and by default removes HTML, so we override it to render our templated HTML
            if (!select2.hasOwnProperty('escapeMarkup')) {
                select2.escapeMarkup = function (m) { return m; };
            }
        }

        // Pass all the set up properties to the select2 constructor and instantiate the select2 box
        $(element).select2(select2);

        // Push item selections to viewmodel
        if (selectedItem) {
            subscribeToSelectedItem(selectedItem, element);
        }

        // ----Handle the user text input----
        if (userInput) {
            subscribeToUserInput(userInput, element);
        }

        // ----Set up the disposal of select2----
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).select2('destroy');
        });
    }

    function init(element, valueAccessor, allBindingsAccessor, viewModel) {
        initializeSelect2(element, valueAccessor, allBindingsAccessor, viewModel);
    }

    return {
        init: init
    };
});