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

        var value = valueAccessor(),
            select2 = value.select2;

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).select2('destroy');
        });

        if ( select2 === undefined) {
            select2 = {};
        }

        select2.data = value.data();

        $(element).select2(value.select2);

        $(element).on("change", function (o) { value.selectedItem(o.val) });

    }

    function update (element, valueAccessor, allBindingsAccessor, viewModel) {
        var allBindings = allBindingsAccessor(),
            value = ko.utils.unwrapObservable(allBindings.value || allBindings.selectedOptions);

        if (value) {
            $(element).select2('val', value);
        }



    }

    return {
        init: init,
        update: update
    };
});