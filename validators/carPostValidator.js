const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = (data) => {
  const errors = {};
  const carData = { ...data };
  carData.state = !isEmpty(carData.state) ? carData.state : '';
  carData.status = !isEmpty(carData.status) ? carData.status : 'available';

  carData.price = !isEmpty(carData.price) ? carData.price : '';

  carData.manufacturer = !isEmpty(carData.manufacturer) ? carData.manufacturer : '';
  carData.model = !isEmpty(carData.model) ? carData.model : '';

  carData.body_type = !isEmpty(carData.body_type) ? carData.body_type : '';

  if (Validator.isEmpty(carData.state)) {
    errors.state = 'State field is required';
  }

  if (carData.state !== 'used' && carData.state !== 'new' && !isEmpty(carData.state)) {
    errors.state = 'state can either be new or used';
  }

  if (carData.status !== 'sold' && carData.status !== 'available' && !isEmpty(carData.status)) {
    errors.status = 'status can either be sold or available';
  }

  if (Validator.isEmpty(carData.status)) {
    errors.status = 'Status field is required';
  }

  if (Validator.isEmpty(carData.price)) {
    errors.price = 'Price field is required';
  }

  if (!Validator.isNumeric(carData.price)) {
    errors.price = 'Price must be a number';
  }

  if (Validator.isEmpty(carData.manufacturer)) {
    errors.manufacturer = 'manufacturer field is required';
  }

  if (Validator.isEmpty(carData.model)) {
    errors.model = 'Model field is required';
  }

  if (Validator.isEmpty(carData.body_type)) {
    errors.body_type = 'body_type isfield is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
