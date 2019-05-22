/* eslint-disable camelcase */
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const carPostValidator = require('../../validators/carPostValidator');
const { addCar, updateCar } = require('../../data/Car');

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
router.patch('/:car_id/:status', authMiddleware, (req, res) => {
  let { car_id, status } = req.params;
  // parse id to number type
  car_id = +car_id;
  if (status === 'sold' || status === 'available') {
    if (!car_id) {
      return res.status(400).json({ status: 400, error: 'Car_id must be a number' });
    }
    updateCar(car_id, 'status', status, (err, updatedCar) => {
      if (!err) {
        return res.status(200).json({ status: 200, data: updatedCar });
      }
      return res.status(400).json({ status: 400, error: err });
    });
  } else {
    return res.status(400).json({ status: 400, error: 'status can either be sold or available' });
  }
});
module.exports = router;
