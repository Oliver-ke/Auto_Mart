/* eslint-disable no-tabs */

// this exports a function that return true if a an object, array or any value is empty
module.exports = (value) => {
  if (
    value === undefined
		|| value === null
		|| (typeof value === 'object' && Object.keys(value).length === 0)
		|| (typeof value === 'string' && value.trim().length === 0)
  ) {
    return true;
  }
  return false;
};
