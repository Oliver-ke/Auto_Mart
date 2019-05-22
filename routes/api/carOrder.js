/* eslint-disable camelcase */
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const carOrderValidator = require('../../validators/carOrderValidator');
const { addOrder, updateOrder } = require('../../data/Order');
const { getCar } = require('../../data/Car');

const router = express.Router();

// @route POST /api/v1/order
// @desc Create an order request
// @access Private, only authenticated users can make orders
router.post('/', authMiddleware, (req, res) => {
  const { errors, isValid } = carOrderValidator(req.body);

  if (!isValid) {
    return res.status(400).json({ status: 400, errors });
  }
  // the + parses value to number type
  const newOrder = {
    price_offered: +req.body.amount,
    car_id: +req.body.car_id,
    buyer: req.userData.id,
    status: req.body.status || 'pending',
    created_on: new Date(),
  };

  // Check for car with the given car_id before adding order
  getCar(newOrder.car_id, null, (car) => {
    if (car) {
      if (car.status !== 'sold') {
        // prevent users from placing order for their own car ads post
        if (car.owner === req.userData.id) {
          return res.status(400).json({ status: 400, error: 'Cannot place order for your own advert' });
        }
        newOrder.price = car.price;
        return addOrder(newOrder, result => res.status(201).json({ status: 201, data: result }));
      }
      return res.status(400).json({ status: 404, error: 'Car has already been sold' });
    }
    return res.status(404).json({ status: 404, error: 'Car with the given car_id does not exist' });
  });
});

// @route PATCH /api/v1/order/<:order_id>/price
// @desc Upate order price
// @access Private, only authenticated users can make update orders
router.patch('/:order_id/:price', authMiddleware, (req, res) => {
  let { order_id, price } = req.params;

  // parse params to number type
  order_id = +order_id;
  price = +price;
  const userId = req.userData.id;
  if (typeof order_id === 'number' && typeof price === 'number') {
    updateOrder(order_id, userId, price, (err, order) => {
      if (!err) {
        return res.status(200).json({ status: 200, data: order });
      }
      return res.status(400).json({ status: 400, error: err });
    });
  } else {
    return res.status(400).json({ status: 400, error: 'parameter not understood' });
  }
});

module.exports = router;
