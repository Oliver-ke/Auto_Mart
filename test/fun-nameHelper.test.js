/* global describe it */
const { assert } = require('chai');
const { nameHelper } = require('../helper/fileNamehelper');

describe('File name test', () => {
  describe('new names should be unique and extension reserved', () => {
    it('should return unique file name', () => {
      const name1 = nameHelper('car.png');
      const name2 = nameHelper('car.png');
      const name3 = nameHelper('car.png');
      // console.table([name1, name2, name3]);
      assert.notEqual(name1, name2);
      assert.notEqual(name3, name1);
      assert.notEqual(name3, name2);
    });
    it('should reserve mimetype', () => {
      const mime1 = nameHelper('car.png').split('.')[1];
      const mime2 = nameHelper('car.jpg').split('.')[1];
      assert.equal(mime1, 'png');
      assert.equal(mime2, 'jpg');
    });
  });
});
