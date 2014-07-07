
/*global define*/
define('scalejs.autocomplete/autocomplete',[
    'jQuery',
    'jquery.better-autocomplete'
], function (
    $
) {
    

    function init(
        element, 
        valueAccessor
    ) {
        console.log("Hello world from autocomplete");
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

