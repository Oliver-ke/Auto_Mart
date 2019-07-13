/* eslint-disable camelcase */
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import carOrderValidator from '../../validators/carOrderValidator';
import { getItems, addItem, updateItem } from '../../db/queryHelpers/helper';

const router = express.Router();

// @route POST /api/v1/order
// @desc Create an order
// @access Private, only authenticated users can make orders
router.post('/', authMiddleware, async (req, res) => {
  const { errors, isValid } = carOrderValidator(req.body);

  if (!isValid) {
    return res.status(400).json({ status: 400, errors });
  }
  // the + parses value to number type
  const newOrder = {
    amount: +req.body.amount,
    car_id: +req.body.car_id,
    buyer: req.userData.id,
    status: req.body.status || 'pending',
    created_on: new Date(),
  };

  // Check for car with the given car_id before adding order
  const { result: carArr } = await getItems('cars', { id: newOrder.car_id });
  const car = carArr[0];
  if (car) {
    if (car.status !== 'sold') {
      // before adding a new order check if order for the same car already exist
      const { result: orders } = await getItems('orders', { car_id: +car.id });
      const privOrder = orders.filter(order => order.buyer === req.userData.id);
      if (!privOrder[0]) {
        newOrder.car_price = car.price;
        newOrder.car_owner = car.owner;
        const { error, result } = await addItem('orders', newOrder);
        if (!error) {
          // format response to numeric types
          const resData = {
            id: result.id,
            car_id: +result.car_id,
            car_owner: +result.car_owner,
            created_on: result.created_on,
            status: result.status,
            price: +result.car_price,
            price_offered: +result.amount,
          };
          return res.status(201).json({ status: 201, data: resData });
        }
        return res.status(500).json({ status: 500, error: 'Server error' });
      }
      return res.status(409).json({ status: 409, error: `Order for car with id ${car.id} already exist` });
    }
    return res.status(404).json({ status: 404, error: 'Car not available' });
  }
  return res.status(404).json({ status: 404, error: 'Car with the given car_id does not exist' });
});

// @route PATCH /api/v1/order/<:order_id>/price
// @desc Upate order price
// @access Private, only authenticated users can make update orders
router.patch('/:order_id/price', authMiddleware, async (req, res) => {
  let { order_id } = req.params;
  let { price } = req.body;
  // parse params to number type
  order_id = +order_id;
  price = +price;
  const userId = req.userData.id;
  if (typeof order_id === 'number' && typeof price === 'number') {
    const { result: orderArr } = await getItems('orders', { id: order_id });
    const order = orderArr[0];
    if (!order) {
      return res.status(404).json({ status: 404, error: 'Order not found' });
    }
    // check if order belongs to user
    if (order.buyer !== userId) {
      return res.status(403).json({ status: 403, error: 'Access denied' });
    }
    // update can only be done for pending orders
    if (order.status !== 'pending') {
      return res.status(403).json({ status: 403, error: 'Cannot update order with status not pending' });
    }
    const { error, result } = await updateItem('orders', order_id, { amount: price });
    if (!error) {
      const resData = {
        id: result.id,
        car_id: +result.car_id,
        status: result.status,
        old_price_offered: +order.amount,
        new_price_offered: +result.amount,
        car_price: +order.car_price,
      };
      return res.status(200).json({ status: 200, data: resData });
    }
    return res.status(500).json({ status: 500, error: 'Server error' });
  }
  return res.status(400).json({ status: 400, error: 'parameter not understood' });
});

// @route PATCH /api/v1/order/<:order_id>/status
// @desc Upate order status
// @access Private, Only car owner can accept or reject order
router.patch('/:order_id/status', authMiddleware, async (req, res) => {
  let { order_id } = req.params;
  let { status } = req.body;
  // parse params to number type
  order_id = +order_id;
  status = status.toLowerCase() === 'accepted' || status === 'rejected' ? status.toLowerCase() : null;
  const userId = req.userData.id;
  if (status) {
    const { result: orderArr } = await getItems('orders', { id: order_id });
    const order = orderArr[0];
    if (!order) {
      return res.status(404).json({ status: 404, error: 'Order not found' });
    }
    // check if the user is the current car owner;
    const { result: carsArr } = await getItems('cars', { id: order.car_id });
    const car = carsArr[0];
    if (car.owner !== userId) {
      return res.status(403).json({ status: 403, error: 'Access denied' });
    }
    const { error, result } = await updateItem('orders', order_id, { status });
    if (!error) {
      const resData = {
        id: result.id,
        car_id: +result.car_id,
        status: result.status,
        old_price_offered: +order.amount,
        new_price_offered: +result.amount,
        car_price: +order.car_price,
      };
      return res.status(200).json({ status: 200, data: resData });
    }
    return res.status(500).json({ status: 500, error: 'Server error' });
  }
  return res.status(400).json({ status: 400, error: 'parameter not understood' });
});

// @route GET /api/v1/order/<order_id>
// @desc get specific order
// @access Public
router.get('/:order_id', async (req, res) => {
  const { order_id: orderId } = req.params;
  const { result, error } = await getItems('orders', { id: Number(orderId) });
  if (!error && result.length > 0) {
    return res.status(200).json({ status: 200, data: result[0] });
  }
  return res.status(404).json({ status: 404, error: 'Order does not exist' });
});

// @route GET /api/v1/order
// @desc get buyers orders
// @access Private, only authenticated users can have orders
router.get('/', authMiddleware, async (req, res) => {
  const { id: userId } = req.userData;
  if (userId) {
    const { result } = await getItems('orders', { buyer: userId });
    if (result) {
      return res.status(200).json({ status: 200, data: result });
    }
    // having userId and no result even an empty array, this must be a server error
    return res.status(500).json({ status: 500, error: 'Server error' });
  }
  // how did this user even get through our middleware
  return res.status(401).json({ status: 401, error: 'UnAuthorized user' });
});

// @route GET /api/v1/order/seller/orders
// @desc get sellers orders
// @access Private, Get orders to a sellers post
router.get('/seller/orders', authMiddleware, async (req, res) => {
  const { id: userId } = req.userData;
  if (userId) {
    const { result } = await getItems('orders', { car_owner: userId });
    if (result) {
      return res.status(200).json({ status: 200, data: result });
    }
    // having userId and no result even an empty array, this must be a server error
    return res.status(500).json({ status: 500, error: 'Server error' });
  }
  // how did this user even get through our middleware
  return res.status(401).json({ status: 401, error: 'UnAuthorized user' });
});

export default router;
