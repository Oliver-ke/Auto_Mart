/* global document localStorage */
import {
 redirect, getId, showAlert, setNavLinks, logout, request 
} from './main.js';

const logoutBtn = document.querySelector('a#logout-btn');
const alert = document.querySelector('.alert');
const spinner = document.querySelector('.container .spinner');
const flagForm = document.querySelector('form');

// Make post flag
const postFlag = async (newData, token) => {
  const url = 'https://auto-mart-ng.herokuapp.com/api/v1/flag';
  const res = await request(url, 'POST', token, newData);
  return res;
};

document.addEventListener('DOMContentLoaded', setNavLinks);

const flagHandler = async (e) => {
  e.preventDefault();
  spinner.classList.remove('hide');
  // Check usser
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    showAlert('Please Login', alert, 'dander');
    return redirect('sign-in.html');
  }
  const reason = document.querySelector('textarea[name=reason]').value;
  const description = document.querySelector('textarea[name=description]').value;
  const carId = getId('car_id');
  if (!carId) {
    return redirect('cars.html');
  }
  const postData = { reason, description, car_id: carId.toString() };
  const { data, error, status } = await postFlag(postData, user.token);
  if (error && Object.values(error).length > 0) {
    spinner.classList.add('hide');
    // return show alerts
    if (typeof error === 'object') {
      spinner.classList.add('hide');
      return showAlert(Object.values(error), alert, 'danger');
    }
    if (status && status === 401) {
      spinner.classList.add('hide');
      showAlert('Please login to send fraud message', alert, 'danger');
      return redirect('sign-in.html');
    }
    spinner.classList.add('hide');
    return showAlert(error, alert, 'danger');
  }
  if (data && Object.values(data).length > 0) {
    // return success alert
    spinner.classList.add('hide');
    await showAlert('Flag posted', alert, 'success', 7000);
    return redirect('cars.html');
  }
};

flagForm.onsubmit = e => flagHandler(e);

// clear localstorage and redirect to login once logout click
logoutBtn.addEventListener('click', logout);
