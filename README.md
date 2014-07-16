scalejs.autocomplete-select2
============================

An autocomplete extension for scalejs based on Select2. This extension provides a way to use select2 and many of its advanced features while still following scalejs patterns. 

# Example Binding

```javascript
autocomplete: {
  select2: {
    placeholder: 'Placeholder Text',
    allowClear: true
  },
  selectedItem: this.selectedItem1,
  userInput: this.userInput1,
  itemsToShow: this.itemsToShow,
  textpath: 'text',
  idpath: 'id'
}
```

# Features

## Direct Passing to Select2

Any object bound to the paramater ```select2``` will be passed directly to select2, allowing the developer to use all of the advanced features of select2 as if they are using select2 directly, with no additional modifications needed.

## Templating

The id of a template defined in the view can be bound to the paramater ```itemTemplate```, and each item in the results dropdown will be rendered using this template. Also, another template id can be bound to 'selectedItemTemplate' to cause the selected item to be rendered with a different template

## Persistent Queries

An observable bound to the paramtater ```userInput``` will expose the user's query to the viewmodel in real time, and cause this query to persist between searches in each select2 box.

## Observable Output

The user's selection is returned to the viewmodel through the knockout observable bound to the ```selectedItem``` parameter, so clean knockout based patterns can be followed easily. ```selectedItem``` is the only paramater that must always be passed, containing an observable.

## Adaptive Input

Instead of providing data using the ```data``` paramater in the select2 object, data can also be passed using the ```data``` parameter in this binding. The autocomplete ```data``` paramater accepts an array that contains either strings or objects. If the array contains strings, autocomple will map it correctly for select2 and take care of all the details. If the array contains objects, the ```textpath``` parameter must be sent to specify the property of the object that containts the string to be rendered if no template is provided. Likewise, the ```idpath``` parameter must be provided to specify which property contains the data returned on selection, else the entire object will be the selected value.

## Dynamic Data Loading

The ```data``` parameter instead of taking an array can also take an observable. If an observable is passed, before every search the binding will get the most updated value it contains and use that to search from.

## Viewmodel Filtering

If a user provides a computed function that computes an array of results based on the ```userInput``` observable, then instead of using select2's search, the binding will use the returned array as the results for the search, allowing for all comparision and filtering logic to be done in the viewmodel.
