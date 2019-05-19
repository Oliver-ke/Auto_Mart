/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

// this file contains an interface for manipulating cars

// memory data store
const Cars = [];
const addCar = (carData, cb) => {
  carData.id = Cars.length + 1;
  Cars.push(carData);
  cb(carData);
};

module.exports = {
  addCar,
};
