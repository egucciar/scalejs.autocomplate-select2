/*global define, console, document*/
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
        computed = ko.computed,
        isObservable = ko.isObservable,
        is = core.type.is;

    // Gets the property for the current level from a path.
    function getProperty(path) {
        if (is(path, 'string')) {
            return path;
        }
        if (is(path, 'array') && path.length > 0) {
            return path[0];
        }
        return undefined;
    }

    // Change the path so that it is correct for the next level of data.
    function getNextProperty(path) {
        var newPath;

        if (is(path, 'string')) {
            return path;
        }
        if (is(path, 'array') && path.length > 1) {
            newPath = path.slice();
            newPath.shift(1);
            if (newPath.length === 1) {
                return newPath[0];
            }
            return newPath;
        }
        console.warn('malformed data when advancing property', path);
        return undefined;
    }

    // Take an array and return an array compatible with select2
    function mapArray(array, idPath, textPath, childPath, selectGroupNodes) {
        return array.map(function (d) {
            var children,
                id,
                text,
                currentChildPath = getProperty(childPath),
                currentIDPath = getProperty(idPath),
                currentTextPath = getProperty(textPath);

            // ----Proccess text field----
            if (currentTextPath) {
                text = d[currentTextPath];
            } else if (is(d, 'string')) {
                text = d;
            } else {// Not fatal since formatting will make this field useless
                text = "No Text Specified";
            }

            // ----Deal with nodes with children----
            if (d.hasOwnProperty(currentChildPath)) {
                children = mapArray(d[currentChildPath], getNextProperty(idPath), getNextProperty(textPath), getNextProperty(childPath), selectGroupNodes);
                if (!selectGroupNodes) {
                    return { text: text, children: children, original: d };
                }
            }

            // ----Deal with selectable nodes----
            id = currentIDPath ? d[currentIDPath] : d;

            if (selectGroupNodes) {
                return { text: text, id: id, children: children, original: d };
            }
            return { text: text, id: id, original: d };
        });
    }

    function initializeSelect2(element, valueAccessor) {

        var // Scope variables
            value = valueAccessor(),
            select2 = value.select2,
            createFormatFunction,
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
            dummyDiv,
            data,
            queryComputed;

        // ----Set up object to pass to select2 with all it's configuration properties----
        if (select2 === undefined) {
            select2 = {};
        }

        // If customFiltering is enabled, display all of them, else let select2 handle the search
        if (customFiltering) {
            select2.query = function (query) {
                if (queryComputed) {
                    queryComputed.dispose();
                }
                queryComputed = computed(function () {
                    data = { results: mapArray(itemsSource(), idpath, textpath, childpath, selectGroupNodes) };
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
                    var results = mapArray(itemsSource(), idpath, textpath, childpath, selectGroupNodes);
                    return { results: results };
                };
            } else if (itemsSource) {// its just a plain array
                select2.data = mapArray(itemsSource, idpath, textpath, childpath, selectGroupNodes);
            }
        }

        // ----handle templating----
        if (itemTemplate) {

            // Create div to render templates inside to get the html to pass to select2, then hide it
            if (document.getElementById("scalejs_autocomplete_dummy_div") === null) {
                $('body').append('<div id="scalejs_autocomplete_dummy_div" data-bind="template: { name: template, data: data }"></div>');
                dummyDiv = document.getElementById("scalejs_autocomplete_dummy_div");
                $(dummyDiv).hide();
            }

            createFormatFunction = function (templateString) {
                return function (d) {

                    ko.cleanNode(dummyDiv);

                    // Clear Dummy Div html node
                    dummyDiv.innerText = '';

                    // render template with (d)
                    ko.applyBindings({ template: templateString, data: d.original }, dummyDiv);

                    // give rendered data to select2
                    return dummyDiv.innerHTML;
                };
            };

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

        // Make sure knockout updates correctly
        if (selectedItem) {
            $(element).on("change", function (o) {
                selectedItem(o.val);
            });
        }

        // ----Handle the user text input----

        container = $(element).select2("container");
        input = $(container).find(".select2-drop .select2-search .select2-input");

        if (userInput) {
            // Push the user input to the viewmodel
            $(input).on("keyup", function () {
                userInput($(input).val());
            });

            // Make sure that the last user input repopulates the input box when reopened
            $(element).on("select2-open", function () {
                $(input).val(userInput());
            });
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