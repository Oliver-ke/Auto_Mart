/* global describe it */
const { assert } = require('chai');
const {
 updateCar, getAllCars, getCar, deleteCar 
} = require('../../data/Car');

describe('Car store function test', () => {
  describe('Delete car function', () => {
    it('should delete a car with a specific id', () => {
      deleteCar(2, (err, result) => {
        assert.equal(result, 'Car ad successfully deleted');
      });
    });
    it('should error when car with the id not found', () => {
      deleteCar(200, (err, result) => {
        assert.equal(result, null);
        assert.isNotNull(err);
      });
    });
  });
  describe('Get car', () => {
    it('should get car with specified id', () => {
      getCar(1, null, (result) => {
        assert.isObject(result);
      });
    });
    it('should get cars with a given option', () => {
      getCar(null, { status: 'available' }, (result) => {
        assert.isArray(result);
        assert.isObject(result[0]);
      });
    });
  });
});
