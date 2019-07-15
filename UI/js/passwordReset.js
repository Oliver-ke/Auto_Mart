/* global document localStorage */
import {
 redirect, request, logout, showAlert, setNavLinks 
} from './main.js';
// target DOM elements
const logoutBtn = document.querySelector('a#logout-btn');
const alert = document.querySelector('.alert');
const spinner = document.querySelector('.container .spinner');
const form = document.querySelector('form');

document.addEventListener('DOMContentLoaded', setNavLinks);

// Handle form submit
const submitHandler = async (e) => {
  e.preventDefault();
  const email = document.querySelector('input[name=email]').value;
  const oldPassword = document.querySelector('input[name=password]').value;
  const newPassword = document.querySelector('input[name=password2]').value;
  const hasPassword = !!oldPassword;
  const reqData = { password: oldPassword, new_password: newPassword };
  if ((oldPassword && !newPassword) || (newPassword && !oldPassword)) {
    return showAlert('Provide both passwords or none', alert, 'danger');
  }
  if (!email) {
    return showAlert('Please provide an email', alert, 'danger');
  }
  const url = `https://auto-mart-ng.herokuapp.com/api/v1/users/${email}/reset_password`;
  spinner.classList.remove('hide');
  const { status, error } = await request(url, 'POST', '', reqData);
  spinner.classList.add('hide');
  if (status === 204) {
    localStorage.removeItem('user');
    if (hasPassword) {
      showAlert('Password Changed, please login', alert, 'success');
      return redirect('sign-in.html');
    }
    const msg = document.querySelector('.costom-msg > p');
    form.classList.add('hide');
    return msg.classList.remove('hide');
  }
  if (status === 404) {
    return showAlert('Email does not exist', alert, 'danger');
  }
  return showAlert(error, alert, 'danger');
};

form.onsubmit = e => submitHandler(e);

// clear localstorage and redirect to login once logout click
logoutBtn.addEventListener('click', logout);
