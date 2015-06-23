/**
 * Created by will on 6/19/15.
 */
var s = require('string');
function filter(arr, queryParams){
    if (arr == null){
        throw "Cannot filter a null array";
    }
    if (queryParams == null){
        return arr;
    }
    var results = [];

    for (var i = 0; i < arr.length; i++){
        var currentItem = arr[i];
        if (__checkIfAllPropertiesContain(currentItem,queryParams)){
            results.push(currentItem);
        }
    }
    return results;
}
function __checkIfAllPropertiesContain(currentItem,queryParams){
    var queryParamKeys = Object.keys(queryParams);

    for (var j = 0; j < queryParamKeys.length; j++){
        var currentPropertyName = queryParamKeys[j];
        var val = currentItem[currentPropertyName];
        if (val === undefined || typeof val !== "string") {
            return false;
        }
        val = val.toLowerCase();

        var currentQueryPropertyValue = queryParams[currentPropertyName];
        if (!__checkIfSingleStringPropertyContains(val,currentQueryPropertyValue)){
            return false;
        }
    }
    return true;
}
function __checkIfSingleStringPropertyContains(val, currentQueryPropertyValue){
    if (typeof currentQueryPropertyValue !== "string" || typeof val !== "string"){
        return true;
    }
    var pieces = currentQueryPropertyValue.toLowerCase().split(' ');
    for (var l = 0; l < pieces.length; l++){
        var piece = pieces[l];
        if (!s(val).include(piece)){
            return false;
        }
    }
    return true;
}
module.exports = exports;
exports.filter = filter;