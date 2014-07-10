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

        if ( select2 === undefined) {
            select2 = {};
        }

        select2.data = value.data();

        $(element).select2(value.select2);

        $(element).on("change", function (o) { value.selectedItem(o.val) });

        $(".select2-input").on("keyup", function (o) {
            value.userInput($(".select2-input").val());
        });

        $(element).on("select2-open", function (o) {
            $(".select2-input").val(value.userInput());
        });

        // Set up the disposal of select2
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).select2('destroy');
        });

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