/*global define, console*/
define([
    'scalejs!core',
    'knockout',
    'formatter'
], function (
    core,
    ko,
    formatter
) {
    "use strict";

    var // Imports
        computed = ko.computed,
        is = core.type.is,
        mapItems = formatter.mapItems,
        // Variables
        data,
        queryComputed;

    function generateQueryFunction(itemsSource, idpath, textpath, childpath, selectGroupNodes) {
        return function (query) {
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
    }

    return generateQueryFunction;
});