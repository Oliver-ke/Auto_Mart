/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

// this file contains an interface for manipulating cars

// memory data store with dummy data for testing
import Cars from './carData';

export const addCar = (carData) => {
  carData.id = Cars.length + 1;
  Cars.push(carData);
  return carData;
};

export const getAllCars = () => Cars;

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

export const getCar = (id, options = null) => {
  if (options) {
    if (options.status && options.minPrice && options.maxPrice) {
      const match = Cars.filter(
        car => car.status === options.status && car.price >= options.minPrice && car.price <= options.maxPrice,
      );
      return match;
    }
    if (options.status && options.state) {
      const match = filterCar(options.status, 'state', options.state);
      return match;
    }
    if (options.status && options.manufacturer) {
      const match = filterCar(options.status, 'manufacturer', options.manufacturer);
      return match;
    }
    if (options.status && options.bodyType) {
      const match = filterCar(options.status, 'body_type', options.bodyType);
      return match;
    }
    const match = Cars.filter(car => car.status === options.status);
    return match;
  }
  const { car } = findCar(id);
  return car;
};

export const updateCar = (id, userId, key, value) => {
  const { car, index } = findCar(id);
  if (car) {
    if (car.owner !== userId) {
      return { error: `Current users has no car with id ${id}`, update: null };
    }
    const update = { ...car, [key]: value };
    Cars[index] = update;
    return { error: null, update };
  }
  return { error: `No car with the given id ${id}`, update: null };
};

export const deleteCar = (id) => {
  const { index } = findCar(id);
  if (index !== null) {
    Cars.splice(index, 1);
    return { error: null, success: 'Car ad successfully deleted' };
  }
  return { error: `Car with id ${id} does not exist`, success: null };
};
