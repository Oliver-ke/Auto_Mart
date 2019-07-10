import validator from 'validator';
import isEmpty from './isEmpty';

export default (flagData) => {
  const errors = {};
  const data = flagData;
  // check if field is empty convert to string to prevent breaking
  data.car_id = !isEmpty(data.car_id) ? data.car_id.toString() : '';
  data.reason = !isEmpty(data.reason) ? data.reason.toString() : '';
  data.description = !isEmpty(data.description) ? data.description.toString() : '';

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
