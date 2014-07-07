/*global define*/
define([
    'scalejs!core',
    'knockout',
    'jQuery',
    'jquery.better-autocomplete',
    'scalejs.mvvm'
], function (
    core,
    ko,
    $
) {
    'use strict';

    var unwrap = ko.unwrap,
        merge = core.object.merge,
        isObservable = ko.isObservable;

    function setupTemplate(template) {
        var $item = $('<div data-bind="template: { name: template, data: data }"></div>')
            .appendTo('body');

        return function(result) {
            var html;
            ko.cleanNode($item.get(0));
            ko.applyBinfings({ template: template, data: result });
            html = $item.html();
            $item.html('');
            return html;
        }
    }

    function setupQuery(matchOn, cond) {
        var cond = cond || 'StartsWith',
            evaluate = {
                'StartsWith': function(r, q) { return r.indexOf(q) === 0 },
                'Contains': function(r, q) { return r.indexOf(q) !== -1 }
            }

        return function (query, resource, caseSensitive) {
            if (!$.isArray(resource)) {
                return [];
            }
            
            return resource.filter(function (r) {
                evaluate[cond](caseSensitive ? r[matchOn] : r[matchOn].toLowerCase(), query)
            });
        }
    }

    function setupCustomFiltering(dropdownSource) {
        return function (url, complete) {
            console.log("Fetching");
            complete();
        }
    }

    function init(
        element, 
        valueAccessor
    ) {
        var config = valueAccessor(),
            resource,
            selectedItem,
            callbacks,
            options;

        if(isObservable(config.selectedItem)) {
            selectedItem = config.selectedItem;
        } else {
            console.warn("scalejs.autocomplete: selectedItem is not an observable");
            selectedItem = ko.observable();
        }

        function selectCallback(result, $input) {
            console.log(result);
            $input.val(result.title);
            selectedItem(result.title);
        }

        callbacks = {
            select: selectCallback,
            themeResult: config.itemTemplate ? setupTemplate(config.itemTemplate) : undefined,
            queryLocalResults: config.valuePath ? setupQuery(config.valuePath, config.matchCondition) : undefined
        }


        if (config.itemsSource) {
            resource = unwrap(config.itemsSource);
        } else if (config.dropdownItems) {
            resource = 'viewmodel'
            callbacks.fetchRemoteData = setupCustomFiltering(unwrap(o))
        }
       

        //callbacks = merge(callbacks, config.callbacks);

        options = merge({}, config.options);


        $(element).betterAutocomplete('init', items, options, callbacks);
    }


    return {
        init: init
    };
});

