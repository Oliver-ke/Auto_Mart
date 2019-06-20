/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
/* eslint-disable camelcase */
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import carPostValidator from '../../validators/carPostValidator';
import {
 addCar, updateCar, getCar, deleteCar, getAllCars 
} from '../../db/queryHelpers/car';
import uploadToCloudinary from '../../helper/uploadToCloudinary';
import {
  stateMiddleware,
  statusMiddleware,
  minMaxMiddleWare,
  manufactureMiddleware,
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
    email: req.userData.email ? req.userData.email.toLowerCase() : 'none',
    price: +req.body.price,
    status: req.body.status ? req.body.status : 'available',
    manufacturer: req.body.manufacturer.toLowerCase(),
  };

  try {
    if (carImg !== null) {
      const uploadResult = await uploadToCloudinary(carImg);
      newCar.img_url = uploadResult.secure_url;
    }
    const { error, result } = await addCar(newCar);
    if (!error) {
      result.price = +result.price;
      return res.status(201).json({ status: 201, data: result });
    }
    return res.status(400).json({ status: 400, error: 'Invalid parameters' });
  } catch (err) {
    return res.status(500).json({ status: 500, error: 'Server Error' });
  }
});

// @route PATCH /car/<:car_id>/status
// @desc Mark posted car as sold
// @access Private, only authenticated users can mark ads as sold
router.patch('/:car_id/status', authMiddleware, async (req, res) => {
  let { car_id } = req.params;
  const { status } = req.body;
  // parse id to number type
  car_id = +car_id;
  const userId = +req.userData.id;
  if (status === 'sold' || status === 'available') {
    if (typeof car_id !== 'number') {
      return res.status(400).json({ status: 400, error: 'Car_id must be a number' });
    }
    // Ensure car exist and belongs to the user
    const { result: car } = await getCar({ id: car_id });
    if (!car) {
      return res.status(404).json({ status: 404, error: 'Not found' });
    }
    if (car.owner !== userId) {
      return res.status(403).json({ status: 403, error: 'Access denied' });
    }
    const { error, result } = await updateCar(car_id, { status });
    if (!error) {
      result.price = +result.price;
      return res.status(200).json({ status: 200, data: result });
    }
    return res.status(500).json({ status: 500, error: 'Server error' });
  }
  return res.status(400).json({ status: 400, error: 'status can either be sold or available' });
});

// @route PATCH /car/<:car_id>/price
// @desc Update car price
// @access Private, only authenticated users can update price
router.patch('/:car_id/price', authMiddleware, async (req, res) => {
  const { car_id } = req.params;
  let { price } = req.body;
  // parse price to number type
  price = isNaN(+price) ? null : +price;
  const userId = +req.userData.id;
  if (car_id && price) {
    const { result: car } = await getCar({ id: car_id });
    if (!car) {
      return res.status(404).json({ status: 404, error: 'Not found' });
    }
    if (car.owner !== userId) {
      return res.status(403).json({ status: 403, error: 'Access denied' });
    }
    const { error, result } = await updateCar(car_id, { price });
    if (!error) {
      result.price = +result.price;
      return res.status(200).json({ status: 200, data: result });
    }
    return res.status(500).json({ status: 500, error: 'Server error' });
  }
  return res.status(400).json({ status: 400, error: 'Invalid request parameter(s) price' });
});

// @route GET /car/<:car_id>
// @desc get a specific car
// @access Public, anyone can view specific car
router.get('/:car_id', async (req, res) => {
  const { car_id } = req.params;
  if (car_id) {
    const { result } = await getCar({ id: car_id });
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
router.get('/', statusMiddleware, minMaxMiddleWare, stateMiddleware, manufactureMiddleware, (req, res) => res.status(400).json({ status: 400, error: 'Invalid query parameters' }),);

// @route DELETE /car/{car_id}
// @desc Admin delete car ads endpoint
// @access Privat, only admin or car owner can delete car ads
router.delete('/:car_id', authMiddleware, async (req, res) => {
  const car_id = req.params.car_id ? +req.params.car_id : null;
  const { isAdmin, id } = req.userData ? req.userData : null;
  if (car_id) {
    // check if user is admin or normal user
    if (!isAdmin) {
      // check if car exist and belongs to the user
      const { result: car } = await getCar({ id: car_id });
      if (car && car.owner === +id) {
        // issue delete
        const { result } = await deleteCar(car_id);
        if (result) {
          return res.status(200).json({ status: 200, data: 'Car Ad successfully deleted' });
        }
        return res.status(500).json({ status: 500, error: 'Server error' });
      }
      // no car exist or user is not owner
      return res.status(403).json({ status: 403, error: 'Access denied' });
    }
    // check if car exist
    const { result: car } = await getCar({ id: car_id });
    if (!car) {
      return res.status(404).json({ status: 404, error: `Car with id ${req.params.car_id} does not exist` });
    }
    const { result } = await deleteCar(car_id);
    if (result) {
      return res.status(200).json({ status: 200, data: 'Car Ad successfully deleted' });
    }
    return res.status(500).json({ status: 500, error: 'Server error' });
  }
  return res.status(400).json({ status: 400, error: `Car id ${car_id} is not valid` });
});

// @route GET /car/
// @desc Admin view all car sold or unsold
// @access Privat, only admin can dview sold and unsold cars
router.get('/admin/cars', authMiddleware, async (req, res) => {
  const { isAdmin } = req.userData;
  if (isAdmin) {
    const { result: cars } = await getAllCars();
    return res.status(200).json({ status: 200, data: cars });
  }
  return res.status(403).json({ status: 403, error: 'Access denied' });
});
export default router;
