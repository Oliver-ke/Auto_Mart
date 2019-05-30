/* eslint-disable max-len */
/* eslint-disable camelcase */
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const carPostValidator = require('../../validators/carPostValidator');
const {
 addCar, updateCar, getCar, deleteCar, getAllCars 
} = require('../../data/Car');
const uploadToCloudinary = require('../../helper/uploadToCloudinary');

const router = express.Router();

// @route POST /car
// @desc Create a car sale ad
// @access Private, only authenticated users can create car sale ad
router.post('/', authMiddleware, (req, res) => {
  const { errors, isValid } = carPostValidator(req.body);
  if (!isValid) {
    return res.status(400).json({ status: 400, errors });
  }
  const carImg = req.files ? req.files.carImg : null;
  const newCar = {
    ...req.body,
    owner: req.userData.id,
    created_on: new Date(),
    email: req.userData.email ? req.userData.email : 'none',
    price: +req.body.price,
    status: req.body.status ? req.body.status : 'available',
  };
  if (carImg !== null) {
    uploadToCloudinary(carImg)
      .then((uploadResult) => {
        newCar.car_img = uploadResult.secure_url;
        addCar(newCar, result => res.status(201).json({ status: 201, data: result }));
      })
      .catch(err => res.status(500).json({ status: 500, error: err }));
  } else {
    addCar(newCar, result => res.status(201).json({ status: 201, data: result }));
  }
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

// @route GET /car?status=avialable | /car?status=avialable&min_price&max_price
// @desc view all unsold cars
// @access Public, anyone can view cars
router.get('/', (req, res) => {
  let { status } = req.query;
  // check for min_price and max_price query params, convert to number type (+)
  const minPrice = req.query.min_price ? +req.query.min_price : null;
  const maxPrice = req.query.max_price ? +req.query.max_price : null;
  status = status ? status.toLowerCase() : null;
  if (status) {
    if (status === 'available' && minPrice && maxPrice) {
      return getCar(null, { status, minPrice, maxPrice }, result => res.status(200).json({ status: 200, data: result }),);
    }
    if (status === 'available') {
      return getCar(null, { status }, result => res.status(200).json({ status: 200, data: result }));
    }
    return res.status(400).json({ status: 400, error: 'status parameter is invalid' });
  }
  return res.status(400).json({ status: 400, error: 'Invalid query parameters' });
});

// @route DELETE /car/{car_id}
// @desc Admin delete car ads endpoint
// @access Privat, only admin can delete car ads
router.delete('/:car_id', authMiddleware, (req, res) => {
  const carId = req.params.car_id ? +req.params.car_id : null;
  const isAdmin = req.userData.isAdmin ? req.userData.isAdmin : null;
  if (carId) {
    // confirm user is admin
    if (!isAdmin) {
      return res.status(403).json({ status: 403, error: 'Unauthorized operation' });
    }
    deleteCar(carId, (err, successMsg) => {
      if (err) {
        return res.status(404).json({ status: 404, error: err });
      }
      return res.status(200).json({ status: 200, data: successMsg });
    });
  } else {
    return res.status(404).json({ status: 404, error: `Car with id ${req.params.car_id} does not exist` });
  }
});

// @route GET /car
// @desc Admin view all car sold or unsold
// @access Privat, only admin can dview sold and unsold cars
router.get('/admin/cars', authMiddleware, (req, res) => {
  const { isAdmin } = req.userData;
  if (isAdmin) {
    return getAllCars(cars => res.status(200).json({ status: 200, data: cars }));
  }
  return res.status(403).json({ status: 403, error: 'Access denied, User is not an admin' });
});
module.exports = router;
