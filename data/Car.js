/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

// this file contains an interface for manipulating cars

// memory data store with dummy data for testing
const Cars = [
  {
    state: 'new',
    status: 'available',
    price: 12300.5,
    manufacturer: 'Toyota inc',
    model: 'Honda',
    body_type: 'car',
    owner: 1,
    created_on: '2019-05-19T17:02:53.271Z',
    email: 'johndoe@gmail.com',
    id: 1,
  },
];
const addCar = (carData, cb) => {
  carData.id = Cars.length + 1;
  Cars.push(carData);
  cb(carData);
};

const getCar = (id, options = null, cb) => {
  if (options) {
    // do something with options such as filtering
  }
  const foundCar = Cars.find(car => car.id === id);
  return cb(foundCar);
};

module.exports = {
  addCar,
  getCar,
};
