/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

// this file contains an interface for manipulating cars

// memory data store with dummy data for testing
const Cars = require('./carData');

const addCar = (carData, cb) => {
  carData.id = Cars.length + 1;
  Cars.push(carData);
  cb(carData);
};

const getAllCars = cb => cb(Cars);

const findCar = (id) => {
  const index = Cars.findIndex(car => car.id === id);
  if (index !== -1) {
    const car = Cars[index];
    const findResult = { index, car };
    return findResult;
  }
  return { index: null, car: null };
};

const filterCar = (status, key, value) => Cars.filter(car => car[key] === value && car.status === status);

const getCar = (id, options = null, cb) => {
  if (options) {
    if (options.status && options.minPrice && options.maxPrice) {
      const match = Cars.filter(
        car => car.status === options.status && car.price >= options.minPrice && car.price <= options.maxPrice,
      );
      return cb(match);
    }
    if (options.status && options.state) {
      const match = filterCar(options.status, 'state', options.state);
      return cb(match);
    }
    if (options.status && options.manufacturer) {
      const match = filterCar(options.status, 'manufacturer', options.manufacturer);
      return cb(match);
    }
    if (options.status && options.bodyType) {
      const match = filterCar(options.status, 'body_type', options.bodyType);
      return cb(match);
    }
    const match = Cars.filter(car => car.status === options.status);
    return cb(match);
  }
  const { car } = findCar(id);
  return cb(car);
};

const updateCar = (id, userId, key, value, cb) => {
  const { car, index } = findCar(id);
  if (car) {
    if (car.owner !== userId) {
      return cb(`Current users has no car with id ${id}`, null);
    }
    const update = { ...car, [key]: value };
    Cars[index] = update;
    return cb(null, update);
  }
  return cb(`No car with the given id ${id}`, null);
};

const deleteCar = (id, cb) => {
  const { index } = findCar(id);
  if (index !== null) {
    Cars.splice(index, 1);
    return cb(null, 'Car ad successfully deleted');
  }
  return cb(`Car with id ${id} does not exist`, null);
};

module.exports = {
  addCar,
  getCar,
  updateCar,
  deleteCar,
  getAllCars,
  findCar,
};
