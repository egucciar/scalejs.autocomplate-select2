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

    function init (element, valueAccessor, allBindingsAccessor, viewModel) {

        var data = valueAccessor();

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).select2('destroy');
        });

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

    function update (element, valueAccessor, allBindingsAccessor, viewModel) {
        var allBindings = allBindingsAccessor();

        if ("value" in allBindings) {
            $(element).select2("data", allBindings.value());
        }

    }

    return {
        init: init,
        update: update
    };
});