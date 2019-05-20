/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

// this file contains an interface for manipulating orders

// memory data store
const Orders = [];
const addOrder = (orderData, cb) => {
  orderData.id = Orders.length + 1;
  Orders.push(orderData);
  cb(orderData);
};

module.exports = {
  addOrder,
};
