/* eslint-disable camelcase */
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const carPostValidator = require('../../validators/carPostValidator');
const { addCar, updateCar, getCar } = require('../../data/Car');

const router = express.Router();

// @route POST /car
// @desc Create a car sale ad
// @access Private, only authenticated users can create car sale ad
router.post('/', authMiddleware, (req, res) => {
  const { errors, isValid } = carPostValidator(req.body);

  if (!isValid) {
    return res.status(400).json({ status: 400, errors });
  }
  const newCar = {
    ...req.body,
    owner: req.userData.id,
    created_on: new Date(),
    email: req.userData.email ? req.userData.email : 'none',
    price: +req.body.price,
    status: req.body.status ? req.body.status : 'available',
  };

  addCar(newCar, result => res.status(201).json({ status: 201, data: result }));
});

// @route PATCH /car/<:car_id>/status
// @desc Mark posted car as sold
// @access Private, only authenticated users can mark ads as sold
router.patch('/:car_id/status', authMiddleware, (req, res) => {
  let { car_id } = req.params;
  const { status } = req.body;
  // parse id to number type
  car_id = +car_id;
  const userId = req.userData.id;
  if (status === 'sold' || status === 'available') {
    if (!car_id) {
      return res.status(400).json({ status: 400, error: 'Car_id must be a number' });
    }
    updateCar(car_id, userId, 'status', status, (err, updatedCar) => {
      if (!err) {
        return res.status(200).json({ status: 200, data: updatedCar });
      }
      return res.status(400).json({ status: 400, error: err });
    });
  } else {
    return res.status(400).json({ status: 400, error: 'status can either be sold or available' });
  }
});

// @route PATCH /car/<:car_id>/price
// @desc Update car price
// @access Private, only authenticated users can update price
router.patch('/:car_id/price', authMiddleware, (req, res) => {
  let { car_id } = req.params;
  let { price } = req.body;
  // parse id to number type
  car_id = +car_id;
  price = +price;
  const userId = req.userData.id;
  if (price && car_id) {
    updateCar(car_id, userId, 'price', price, (err, updatedCar) => {
      if (!err) {
        return res.status(200).json({ status: 200, data: updatedCar });
      }
      return res.status(400).json({ status: 400, error: err });
    });
  } else {
    return res.status(400).json({ status: 400, error: 'car_id and price must be a number type' });
  }
});

// @route GET /car/<:car_id>
// @desc get a specific car
// @access Public, anyone can view specific car
router.get('/:car_id', (req, res) => {
  let { car_id } = req.params;
  // parse car_id to number type
  car_id = +car_id;
  if (car_id) {
    getCar(car_id, null, (result) => {
      if (!result) {
        return res.status(404).json({ status: 404, error: `car with id ${car_id} does not exist` });
      }
      return res.status(200).json({ status: 200, data: result });
    });
  } else {
    return res.status(400).json({ status: 400, error: 'car_id should be a number type' });
  }
});

// @route GET /car?status='avialable'
// @desc view all unsold cars
// @access Public, anyone can view cars
router.get('/', (req, res) => {
  let { status } = req.query;
  status = status.toLowerCase();
  if (status) {
    if (status === 'available') {
      return getCar(null, { status }, result => res.status(200).json({ status: 200, data: result }));
    }
    return res.status(400).json({ status: 400, error: 'status parameter is invalid' });
  }
  return res.status(400).json({ status: 400, error: 'Invalid query parameters' });
});
module.exports = router;
