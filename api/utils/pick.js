/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            // eslint-disable-next-line no-param-reassign
            obj[key] = object[key];
        }
        return obj;
    }, {});
};

/**
 * 
 * @param {Array} array 
 * @param {string[]} keys 
 * @returns {Array}
 */
const pickInArray = (array, keys) => {
    const newArray = []
    array.forEach((object) => {
        newArray.push(pick(object, keys));
    });

    return newArray;
};

module.exports = { pick, pickInArray };
