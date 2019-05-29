const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = (flagData) => {
  const errors = {};
  const data = flagData;
  data.car_id = !isEmpty(data.car_id) ? data.car_id : '';
  data.reason = !isEmpty(data.reason) ? data.reason : '';
  data.description = !isEmpty(data.description) ? data.description : '';

  //  check for empty fields
  if (validator.isEmpty(data.car_id)) {
    errors.car_id = 'car_id is required';
  }

  if (validator.isEmpty(data.reason)) {
    errors.reason = 'reason field is required';
  }

  if (validator.isEmpty(data.description)) {
    errors.description = 'description field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
