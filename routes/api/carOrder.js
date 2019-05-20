const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const carOrderValidator = require('../../validators/carOrderValidator');
const { addOrder } = require('../../data/Order');
const { getCar } = require('../../data/Car');

const router = express.Router();

// @route POST /
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
      newOrder.price = car.price;
      return addOrder(newOrder, result => res.status(201).json({ status: 201, data: result }));
    }
    return res.status(404).json({ status: 404, error: 'Car with the given car_id does not exist' });
  });
});
module.exports = router;
