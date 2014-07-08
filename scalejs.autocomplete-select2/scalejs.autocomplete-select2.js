/*global define*/
define([
    'knockout',
    './scalejs.autocomplete-select2/autocomplete'
], function (
    ko,
    autocomplete
) {
    'use strict';

    ko.bindingHandlers.autocomplete = autocomplete;
});

