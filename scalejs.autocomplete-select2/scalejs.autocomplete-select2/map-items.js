/*global define, console*/
define([
    'scalejs!core'
], function (
    core
) {
    "use strict";

    var // Imports
        is = core.type.is;

    // Gets the property for the current level from a path.
    function getProperty(path) {
        if (is(path, 'string')) {
            return path;
        }
        if (is(path, 'array') && path.length > 0) {
            return path[0];
        }
        return undefined;
    }

    // Change the path so that it is correct for the next level of data.
    function getNextProperty(path) {
        var newPath;

        if (is(path, 'string')) {
            return path;
        }
        if (is(path, 'array') && path.length > 1) {
            newPath = path.slice();
            // give tail of array as the path for next level of data
            newPath.shift(1);

            return (newPath.length === 1)
                    ? newPath[0]
                    : newPath;
        }
        console.error('malformed data when advancing property', path);
        return undefined;
    }

    // Take an array and return an array compatible with select2
    function mapItems(items, idPath, textPath, childPath, selectGroupNodes) {
        return items.map(function (item) {
            var children,
                id,
                text,
                currentChildPath = getProperty(childPath),
                currentIDPath = getProperty(idPath),
                currentTextPath = getProperty(textPath);

            // ----Proccess text field----
            if (currentTextPath) {
                text = item[currentTextPath];
            } else if (is(item, 'string')) {
                text = item;
            } else {// Not fatal since formatting will make this field useless
                text = "No Text Specified";
            }

            // ----Deal with nodes with children----
            if (item.hasOwnProperty(currentChildPath)) {
                children = mapItems(item[currentChildPath], getNextProperty(idPath), getNextProperty(textPath), getNextProperty(childPath), selectGroupNodes);
                if (!selectGroupNodes) {
                    return { text: text, children: children, original: item };
                }
            }

            // ----Deal with selectable nodes----
            id = currentIDPath ? item[currentIDPath] : item;

            if (selectGroupNodes) {
                return { text: text, id: id, children: children, original: item };
            }
            return { text: text, id: id, original: item };
        });
    }

    return mapItems;
});