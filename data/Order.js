/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

// this file contains an interface for manipulating orders

// memory data store
const Orders = [
  {
    price_offered: 223456,
    car_id: 1,
    buyer: 2,
    status: 'pending',
    created_on: '2019-05-21T22:18:55.087Z',
    price: 12300.5,
    id: 1,
  },
  {
    price_offered: 223456,
    car_id: 2,
    buyer: 1,
    status: 'pending',
    created_on: '2019-05-21T22:18:55.087Z',
    price: 12500.5,
    id: 2,
  },
];

const addOrder = (orderData, cb) => {
  orderData.id = Orders.length + 1;
  Orders.push(orderData);
  return cb(orderData);
};

const findOrder = (id) => {
  const index = Orders.findIndex(order => order.id === id);
  if (index !== -1) {
    const order = Orders[index];
    const findResult = { index, order };
    return findResult;
  }
  return null;
};

const updateOrder = (id, userId, newPrice, cb) => {
  // check if the order exist
  const { order, index } = findOrder(id);
  if (order) {
    if (order.status === 'pending') {
      // confirm that the owner of the order matches the authenticated user
      if (userId === order.buyer) {
        const oldPrice = order.price_offered;
        const update = {
          ...order,
          price_offered: newPrice,
          old_price_offered: oldPrice,
          new_price_offered: newPrice,
        };
        Orders[index] = update;

        return cb(null, update);
      }
      return cb('User Id does not match order owner id');
    }
    return cb('Order status is not pending', null);
  }
  return cb(`Order with id ${id} does not exist`, null);
};

module.exports = {
  addOrder,
  updateOrder,
};
