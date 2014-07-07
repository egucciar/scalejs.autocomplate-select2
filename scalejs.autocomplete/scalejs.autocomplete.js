/*global define*/
define([
    'knockout',
    './scalejs.autocomplete/autocomplete'
], function (
    ko,
    autocomplete
) {
    'use strict';

    ko.bindingHandlers.autocomplete = autocomplete;
});

