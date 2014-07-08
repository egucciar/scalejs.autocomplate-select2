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
    'use strict';

    var // Imports
        observable = ko.observable,
        computed = ko.computed,
        unwrap = ko.unwrap,
        isObservable = ko.isObservable,
        merge = core.object.merge;

    function init(element) {
        var data = valueAccessor();

        alert('Hello World');
        $(element).select2({
            query: function (query) {
                var results = data.filter(function (d) {
                    d.indexOf(query) === 0;
                });
                query.callback(results);
            }
        });
    }

    function update () {

    }

    return {
        init: init,
        update: update
    };
});