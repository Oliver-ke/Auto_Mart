/* global describe it  */
const chai = require('chai');

const { assert } = chai;
const isEmpty = require('../validators/isEmpty');

describe('checking test', () => {
  it('should return something', () => {
    const obj = { name: 'some name' };
    assert(isEmpty(obj), obj);
  });
});
