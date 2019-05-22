const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const carPostValidator = require('../../validators/carPostValidator');
const { addCar } = require('../../data/Car');

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
module.exports = router;
