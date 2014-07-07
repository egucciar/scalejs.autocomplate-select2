/*global define */
/*jslint sloppy: true*/
define({
    'main-autocomplete': function () {
        return {
            autocomplete: {
                selectedItem: this.selectedCity,
                items: this.locations
            }
        };
    }
});
