/**
 * User: jchionh
 * Date: 10/27/13
 * Time: 2:35 PM
 */
// create namespace
rt.utils = rt.utils || {};

/**
 * implement the extend using prototype inheritance extend method
 *
 * @param {Object} newObject the derived object
 * @param {Object} baseObject the base object to derive from
 */
rt.utils.extend = function(newObject, baseObject) {
    newObject.prototype = new baseObject();
    newObject.prototype.constructor = newObject;
};