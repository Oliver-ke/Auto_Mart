import Validator from 'validator';
import isEmpty from './isEmpty';

export default (data) => {
  const errors = {};
  const userData = data;
  userData.email = !isEmpty(userData.email) ? userData.email : '';
  userData.password = !isEmpty(userData.password) ? userData.password : '';

  if (!Validator.isEmail(userData.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(userData.email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(userData.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
