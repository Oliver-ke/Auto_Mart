import Validator from 'validator';
import isEmpty from './isEmpty';

export default (data) => {
  const errors = {};
  const orderData = { ...data };
  orderData.amount = !isEmpty(orderData.amount) ? orderData.amount.toString() : '';
  orderData.car_id = !isEmpty(orderData.car_id) ? orderData.car_id.toString() : '';

  if (Validator.isEmpty(orderData.amount)) {
    errors.amount = 'amount field is required';
  }
  if (Validator.isEmpty(orderData.car_id)) {
    errors.car_id = 'car_id field is required';
  }

  if (orderData.status) {
    if (orderData.status !== 'pending' && orderData.status !== 'accepted' && orderData.status !== 'rejected') {
      errors.status = 'status can either be pending, accepted or rejected';
    }
  }

  if (!Validator.isNumeric(orderData.amount)) {
    errors.amount = 'Amount must be a number';
  }

  if (!Validator.isNumeric(orderData.car_id)) {
    errors.car_id = 'car_id must be a number';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
