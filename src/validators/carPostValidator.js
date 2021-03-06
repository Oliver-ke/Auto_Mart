import Validator from 'validator';
import isEmpty from './isEmpty';

export default (data) => {
  const errors = {};
  const carData = { ...data };
  carData.state = !isEmpty(carData.state) ? carData.state.toString() : '';
  carData.status = !isEmpty(carData.status) ? carData.status.toString() : 'available';

  carData.price = !isEmpty(carData.price) ? carData.price.toString() : '';

  carData.manufacturer = !isEmpty(carData.manufacturer) ? carData.manufacturer.toString() : '';
  carData.model = !isEmpty(carData.model) ? carData.model.toString() : '';

  carData.body_type = !isEmpty(carData.body_type) ? carData.body_type.toString() : '';

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
