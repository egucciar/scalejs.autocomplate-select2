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


    var // Imports
        observable = ko.observable,
        computed = ko.computed,
        unwrap = ko.unwrap,
        isObservable = ko.isObservable,
        merge = core.object.merge;

    function init(element, valueAccessor) {
        var data = valueAccessor();

        $(element).select2({
            query: function (query) {
                var mappedData = data.map(function (d) { return { text: d }; }),
                    results = mappedData.filter(function (d) {
                        return d.text.indexOf(query.term) === 0;
                    });
                query.callback({ results: results });
            }
        });
    }

    function update() {

    }

    return {
        init: init,
        update: update
    };
});