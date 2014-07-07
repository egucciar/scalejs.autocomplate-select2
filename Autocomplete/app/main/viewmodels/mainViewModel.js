/*global define */
define([
    'sandbox!main'
], function (
    sandbox
) {
    'use strict';

    return function () {
        var // imports
            observable = sandbox.mvvm.observable,
            // properties
            selectedCity = observable(),
            cities,
            locations;

        cities = ['Stockholm', 'New York', 'Oslo', 'San Fransisco'];
        locations = cities.map(function (c) {
            return {
                country: "America",
                population: 500,
                city: c
            }
            return c;
        });

        selectedCity.subscribe(function (city) {
            console.log("Selected city", city)
        });

        return {
            selectedCity: selectedCity,
            cities: cities,
            locations: locations
        };
    };
});
