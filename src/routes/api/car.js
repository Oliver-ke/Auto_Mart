/* eslint-disable max-len */
/* eslint-disable camelcase */
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import carPostValidator from '../../validators/carPostValidator';
import {
 addCar, updateCar, getCar, deleteCar, getAllCars 
} from '../../data/Car';
import uploadToCloudinary from '../../helper/uploadToCloudinary';
import {
  stateMiddleware,
  statusMiddleware,
  minMaxMiddleWare,
  manufactureMiddleware,
  bodyTypeMiddleware,
} from '../middlewares/queryMiddleware';

const router = express.Router();

// @route POST /car
// @desc Create a car sale ad
// @access Private, only authenticated users can create car sale ad
router.post('/', authMiddleware, async (req, res) => {
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
    try {
      const uploadResult = await uploadToCloudinary(carImg);
      newCar.car_img = uploadResult.secure_url;
      const result = addCar(newCar);
      return res.status(201).json({ status: 201, data: result });
    } catch (err) {
      return res.status(500).json({ status: 500, error: err });
    }
  }
  const result = addCar(newCar);
  return res.status(201).json({ status: 201, data: result });
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
    const result = updateCar(car_id, userId, 'status', status);
    if (!result.error) {
      return res.status(200).json({ status: 200, data: result.update });
    }
    return res.status(400).json({ status: 400, error: result.error });
  }
  return res.status(400).json({ status: 400, error: 'status can either be sold or available' });
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
    const result = updateCar(car_id, userId, 'price', price);
    if (!result.error) {
      return res.status(200).json({ status: 200, data: result.update });
    }
    return res.status(400).json({ status: 400, error: result.error });
  }
  return res.status(400).json({ status: 400, error: 'car_id and price must be a number type' });
});

// @route GET /car/<:car_id>
// @desc get a specific car
// @access Public, anyone can view specific car
router.get('/:car_id', (req, res) => {
  let { car_id } = req.params;
  // parse car_id to number type
  car_id = +car_id;
  if (car_id) {
    const result = getCar(car_id, null);
    if (!result) {
      return res.status(404).json({ status: 404, error: `car with id ${car_id} does not exist` });
    }
    return res.status(200).json({ status: 200, data: result });
  }
  return res.status(400).json({ status: 400, error: 'car_id should be a number type' });
});

// @route GET /car?status=avialable | /car?status=avialable&min_price&max_price
// @desc view cars using query
// @access Public, anyone can view cars
router.get(
  '/',
  statusMiddleware,
  minMaxMiddleWare,
  stateMiddleware,
  manufactureMiddleware,
  bodyTypeMiddleware,
  (req, res) => res.status(400).json({ status: 400, error: 'Invalid query parameters' }),
);

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
    const result = deleteCar(carId);
    if (!result.error) {
      return res.status(200).json({ status: 200, data: result.success });
    }
    return res.status(404).json({ status: 404, error: result.error });
  }
  return res.status(404).json({ status: 404, error: `Car with id ${req.params.car_id} does not exist` });
});

// @route GET /car/
// @desc Admin view all car sold or unsold
// @access Privat, only admin can dview sold and unsold cars
router.get('/admin/cars', authMiddleware, (req, res) => {
  const { isAdmin } = req.userData;
  if (isAdmin) {
    const result = getAllCars();
    return res.status(200).json({ status: 200, data: result });
  }
  return res.status(403).json({ status: 403, error: 'Access denied, User is not an admin' });
});
export default router;
