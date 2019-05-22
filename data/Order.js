/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

// this file contains an interface for manipulating orders

// memory data store
const Orders = [];
const addOrder = (orderData, cb) => {
  orderData.id = Orders.length + 1;
  Orders.push(orderData);
  return cb(orderData);
};

const getOrder = (id) => {
  const foundOrder = Orders.find(order => order.id === id);
  return foundOrder;
};

const updateOrder = (id, userId, newPrice, cb) => {
  // check if the order exist
  const order = getOrder(id);
  if (order) {
    if (order.status === 'pending') {
      // confirm that the owner of the order matches the authenticated user
      if (userId === order.buyer) {
        // since the order id is the priv length + 1, then the index is id - 1
        // e.g if id=1 then its index=0
        const oldPrice = order.price_offered;
        const update = {
          ...order,
          price_offered: newPrice,
          old_price_offered: oldPrice,
          new_price_offered: newPrice,
        };
        Orders[id - 1] = update;

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
