import validator from 'validator';
import isEmpty from './isEmpty';

export default (data) => {
  const errors = {};
  const userData = data;
  userData.first_name = !isEmpty(userData.first_name) ? userData.first_name.toString() : '';
  userData.last_name = !isEmpty(userData.last_name) ? userData.last_name.toString() : '';
  userData.email = !isEmpty(userData.email) ? userData.email.toString() : '';
  userData.password = !isEmpty(userData.password) ? userData.password.toString() : '';
  userData.address = !isEmpty(userData.address) ? userData.address.toString() : '';

  if (!validator.isLength(userData.first_name, { min: 2, max: 15 })) {
    errors.first_name = 'First name must be between 2 and 15 characters';
  }

  if (!validator.isAlpha(userData.first_name)) {
    errors.first_name = 'First name must be an alphabet';
  }

  if (!validator.isLength(userData.last_name, { min: 2, max: 15 })) {
    errors.last_name = 'Last Name must be between 2 and 15 characters';
  }

  if (validator.isEmpty(data.first_name)) {
    errors.first_Name = 'First_name field is required';
  }
  if (!validator.isAlpha(userData.last_name)) {
    errors.last_name = 'Last_name must be an alphabet';
  }

  if (validator.isEmpty(data.last_name)) {
    errors.last_name = 'last_name field is required';
  }

  if (!validator.isLength(userData.address, { min: 5, max: 35 })) {
    errors.lastName = 'Address must be between 5 and 35 characters';
  }

  if (validator.isEmpty(data.address)) {
    errors.lastName = 'Address field is required';
  }

  if (validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
