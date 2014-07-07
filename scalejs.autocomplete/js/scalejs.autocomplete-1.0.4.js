
/*global define*/
define('scalejs.autocomplete/autocomplete',[
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
    

    var unwrap = ko.unwrap,
        merge = core.object.merge,
        isObservable = ko.isObservable;

    function init(
        element, 
        valueAccessor
    ) {
        var config = valueAccessor(),
            items = unwrap(config.items),
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

        callbacks = merge({
            select: selectCallback
        }, config.callbacks);

        options = merge({}, config.options);


        $(element).betterAutocomplete('init', items, options, callbacks);
    }


    return {
        init: init
    };
});


/*global define*/
define('scalejs.autocomplete',[
    'knockout',
    './scalejs.autocomplete/autocomplete'
], function (
    ko,
    autocomplete
) {
    

    ko.bindingHandlers.autocomplete = autocomplete;
});

