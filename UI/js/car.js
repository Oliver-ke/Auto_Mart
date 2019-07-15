/* global document */
import {
 redirect, showAlert, formatDate, request, getId, getUser, logout
} from './main.js';
// target DOM elements
const editBtn = document.querySelector('#change-price');
const deleteBtn = document.querySelector('#delete');
const logoutLink = document.querySelector('li.hide');
const logoutBtn = document.querySelector('a#logout-btn');
const dashLink = document.querySelector('li.logout');
const priceInput = document.querySelector('input[name=updatePrice]');
const statusInput = document.querySelector('input[name=status]');
const content = document.querySelector('section.hide');
const alert = document.querySelector('.alert');
const spinner = document.querySelector('.container .spinner');
const spinner2 = document.querySelector('.update');
const updateForm = document.querySelector('form');

// update ui
const updateUI = (data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  keys.map((key, index) => {
    if (key === 'image_url') {
      // set for img
      document.querySelector(`img#${key}`).src = values[index];
    } else if (key === 'created_on') {
      // formate date
      const date = formatDate(values[index]);
      document.querySelector(`span#${key}`).innerText = ` ${date}`;
    } else if (key === 'price') {
      document.querySelector(`span#${key}`).innerText = ` #${values[index]}`;
    } else {
      document.querySelector(`span#${key}`).innerText = ` ${values[index]}`;
    }
  });
};

// Fetch car data
const sendReqest = async (id, method = 'GET', token = '') => {
  const url = `https://auto-mart-ng.herokuapp.com/api/v1/car/${id}`;
  const res = await request(url, method, token);
  return res;
};

const setInput = (user, rest) => {
  if (!user.is_admin) {
    statusInput.checked = rest.status === 'sold';
    statusInput.setAttribute('status', rest.status);
  } else {
    // hide update controls since user is admin
    editBtn.classList.add('hide');
    priceInput.classList.add('hide');
    statusInput.classList.add('hide');
    document.querySelector('#update').classList.add('hide');
    document.querySelector('#status-txt').classList.add('hide');
  }
  spinner.classList.add('hide');
  content.classList.remove('hide');
  dashLink.classList.remove('hide');
  logoutLink.classList.remove('hide');
};

// Make update request
const updateCar = async (id, newData, token) => {
  const path = newData.price ? 'price' : 'status';
  const url = `https://auto-mart-ng.herokuapp.com/api/v1/car/${id}/${path}`;
  const data = await request(url, 'PATCH', token, newData);
  return data;
};

// loads car datail
const loadDetail = async () => {
  const carId = getId('car_id');
  // Check usser
  const user = getUser();
  if (!user) {
    return redirect('sign-in.html');
  }
  const { data: car, error } = await sendReqest(carId);
  if (error) {
    if (user.is_admin) {
      return redirect('admin-dashboard.html');
    }
    return redirect('dashboard.html');
  }
  const {
 email, owner, id, ...rest
} = car;
  updateUI(rest);
  return setInput(user, rest);
};

document.addEventListener('DOMContentLoaded', loadDetail);

const show = (errors, updates) => {
  if (Object.values(errors).length > 0) {
    spinner2.classList.add('hide');
    priceInput.classList.add('hidden');
    priceInput.value = '';
    // return show alerts
    if (typeof errors === 'object') {
      showAlert();
      return showAlert(Object.values(errors), alert, 'danger');
    }
    return showAlert(errors, alert, 'danger');
  }
  if (Object.values(updates).length > 0) {
    // return success alert
    spinner2.classList.add('hide');
    priceInput.classList.add('hidden');
    priceInput.value = '';
    loadDetail();
    return showAlert('Update was Successful', alert, 'success');
  }
  spinner2.classList.add('hide');
  // reaching here means no input
  return showAlert('Noting to update', alert, 'danger');
};

const updateHandler = async (e) => {
  e.preventDefault();
  const status = statusInput.checked ? 'sold' : 'available';
  const price = priceInput.value;
  const carId = getId('car_id');
  const { token } = getUser();
  let errors = {};
  let updates = {};
  spinner2.classList.remove('hide');
  if (status !== statusInput.getAttribute('status')) {
    const { error: statusErr, data: statusData } = await updateCar(carId, { status }, token);
    errors = { ...errors, ...statusErr };
    updates = { ...updates, ...statusData };
  }
  if (!priceInput.classList.contains('hidden')) {
    if (price === '') {
      spinner2.classList.add('hide');
      return showAlert('Price cannot be empty', alert, 'danger');
    }
    const { error: priceErr, data: priceData } = await updateCar(carId, { price }, token);
    errors = { ...errors, ...priceErr };
    updates = { ...updates, ...priceData };
  }
  return show(errors, updates);
};

updateForm.onsubmit = e => updateHandler(e);

// handles delete
deleteBtn.addEventListener('click', async () => {
  const carId = getId('car_id');
  const user = getUser();
  spinner2.classList.remove('hide');
  const { status, error } = await sendReqest(carId, 'DELETE', user.token);
  spinner2.classList.add('hide');
  if (!error && status === 200) {
    showAlert('Advert Deleted', alert, 'success');
    if (user.is_admin) {
      return redirect('admin-dashboard.html');
    }
    return redirect('dashboard.html');
  }
  showAlert(error, alert, 'danger');
  return redirect('sign-in.html');
});

// clear localstorage and redirect to login once logout click
logoutBtn.addEventListener('click', logout);

// toggle edit input visbility
editBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (priceInput.classList.contains('hidden')) {
    const privAmount = document.querySelector('span#price').innerText.slice(2);
    priceInput.value = privAmount;
    priceInput.classList.remove('hidden');
  } else {
    priceInput.classList.add('hidden');
    priceInput.value = '';
  }
});
