
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
    

    var unwrap = ko.unwrap;

    function init(
        element, 
        valueAccessor
    ) {
        var config = valueAccessor(),
            items = unwrap(config.items);

        $(element).betterAutocomplete('init', items, {}, {});
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

