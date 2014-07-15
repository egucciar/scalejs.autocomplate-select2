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
        merge = core.object.merge,
        is = core.type.is;

    function mapArray(array, idpath, textpath) {
        return array.map(function (d) {
            var id = (idpath) ? d[idpath] : d,
                text;

            if (textpath) {
                text = d[textpath];
            } else if (is(d, 'string')) {
                text = d;
            } else {
                console.warn('Input has not specified text field');
                text = "";
            }

            return { id: id, text: text }
        })
    }

    function initializeSelect2 (element, valueAccessor, allBindingsAccessor, viewModel) {

        var // Scope variables
            value = valueAccessor(),
            select2 = value.select2,
            userIsHandlingFormatting,
            createFormatFunction,
            container,
            input,
            // Important Values from accessor
            itemsToShow =           value.itemsToShow,
            itemTemplate =          value.itemTemplate,
            selectedItemTemplate =  value.selectedItemTemplate,
            idpath =                value.idpath,
            textpath =              value.textpath,
            userInput =             value.userInput,
            selectedItem =          value.selectedItem,
            data =                  value.data,
            // Temporary variables
            formatFunction,
            dummyDiv,
            queryComputed;

        // ----Set up object to pass to select2 with all it's configuration properties----
        if ( select2 === undefined) {
            select2 = {};
        } 
        // If they passed itemsToShow, display all of them, else let select2 handle the search
        if (itemsToShow) {
            select2.query = function (query) {
                if (queryComputed) {
                    queryComputed.dispose();
                }
                queryComputed = computed(function () {
                    data = {
                        results: itemsToShow()
                    }
                    if (!is(data.results, 'array')) {
                        console.warn('itemsToShow must return an array');
                        data.results = [];
                    }
                    query.callback(data);
                });
            }
        } else if (data) {
            if (isObservable(data)) {
                select2.data = function () {
                    return { results: mapArray(data(), idpath, textpath) };
                }
            } else {// its just a plain array
                data = mapArray(data, idpath, textpath);
            }
            select2.data = data;
        }

        // ----handle templating----
        if ( itemTemplate ) {

            // Create div to render templates inside to get the html to pass to select2
            $('body').append('<div id="dummy_div" data-bind="template: { name: template, data: data }"></div>');
            dummyDiv = document.getElementById("dummy_div");
            $(dummyDiv).hide();

            createFormatFunction = function (templateString) {
                return function (d) {
                    ko.cleanNode(dummyDiv);
                    // Clear Dummy Div html node
                    dummyDiv.innerText = '';
                    // render template with (d)
                    ko.applyBindings({ template: templateString, data: (idpath)? d : d.id }, dummyDiv);

                    // give rendered data to select2
                    return dummyDiv.innerHTML;
                }
            }

            select2.formatResult = createFormatFunction(itemTemplate);
            select2.formatSelection = select2.formatResult;

            if (selectedItemTemplate) {
                select2.formatSelection = createFormatFunction(selectedItemTemplate);
            }
            if (!select2.hasOwnProperty('escapeMarkup')) {
                select2.escapeMarkup = function (m) { return m; }
            }
        }

        // Pass all the set up properties to the select2 constructor and instantiate the select2 box
        $(element).select2(select2);

        // Make sure knockout updates correctly
        $(element).on("change", function (o) {
            selectedItem(o.val);
        });

        // ----Handle the user text input----

        container = $(element).select2("container");
        input = $(container).find(".select2-drop .select2-search .select2-input");

        if (userInput) {
            // Push the user input to the viewmodel
            $(input).on("keyup", function (o) {
                userInput($(input).val());
            });

            // Make sure that the last user input repopulates the input box when reopened
            $(element).on("select2-open", function (o) {
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