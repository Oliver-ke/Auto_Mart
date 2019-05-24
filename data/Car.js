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
  {
    state: 'used',
    status: 'available',
    price: 1000.5,
    manufacturer: 'Toyota inc',
    model: 'Land cruiser',
    body_type: 'jeep',
    owner: 2,
    created_on: '2019-05-19T17:02:53.271Z',
    email: 'johndoe@gmail.com',
    id: 2,
  },
  {
    state: 'used',
    status: 'sold',
    price: 1000.5,
    manufacturer: 'Toyota inc',
    model: 'Land cruiser',
    body_type: 'jeep',
    owner: 3,
    created_on: '2019-05-19T17:02:53.271Z',
    email: 'johndoe@gmail.com',
    id: 3,
  },
  {
    state: 'used',
    status: 'available',
    price: 1000.5,
    manufacturer: 'Toyota inc',
    model: 'Land cruiser',
    body_type: 'jeep',
    owner: 1,
    created_on: '2019-05-19T17:02:53.271Z',
    email: 'johndoe@gmail.com',
    id: 4,
  },
  {
    state: 'used',
    status: 'available',
    price: 1000.5,
    manufacturer: 'Toyota inc',
    model: 'Land cruiser',
    body_type: 'jeep',
    owner: 5,
    created_on: '2019-05-19T17:02:53.271Z',
    email: 'johndoe@gmail.com',
    id: 5,
  },
];

const addCar = (carData, cb) => {
  carData.id = Cars.length + 1;
  Cars.push(carData);
  cb(carData);
};

const findCar = (id) => {
  const index = Cars.findIndex(car => car.id === id);
  if (index !== -1) {
    const car = Cars[index];
    const findResult = { index, car };
    return findResult;
  }
  return { index: null, car: null };
};

const getCar = (id, options = null, cb) => {
  if (options) {
    if (options.status && options.minPrice && options.maxPrice) {
      const match = Cars.filter(
        car => car.status === options.status && car.price >= options.minPrice && car.price <= options.maxPrice,
      );
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
  return cb(`No car with the give id ${id}`, null);
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
};
