/* global describe it */
const { assert } = require('chai');
const isEmpty = require('../validators/isEmpty');

describe('Test for isEmpty', () => {
  it('should return true for empty object,string or array', () => {
    const objResult = isEmpty({});
    const arrResult = isEmpty([]);
    const strResult = isEmpty('');
    assert.isTrue(objResult, 'result should be true for empty object');
    assert.isTrue(arrResult, 'result should be true for empty array');
    assert.isTrue(strResult, 'result should be true for empty string');
  });
  it('should return false for none empty object,string or array', () => {
    const objResult = isEmpty({ name: 'Andela' });
    const arrResult = isEmpty([1, 2, 3, 4, 5]);
    const strResult = isEmpty('some strings or number');
    assert.isFalse(objResult, 'result should be false for non-empty object');
    assert.isFalse(arrResult, 'result should be false for none-empty array');
    assert.isFalse(strResult, 'result should be false for none-empty string');
  });
});
