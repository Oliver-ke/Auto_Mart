/* global document localStorage */
import {
 redirect, formatDate, showAlert, request, logout, getId, setNavLinks 
} from './main.js';
// target DOM elements
const logoutBtn = document.querySelector('a#logout-btn');
const priceInput = document.querySelector('input[name=biding-price]');
const content = document.querySelector('section.hide');
const alert = document.querySelector('.alert');
const spinner = document.querySelector('.container .spinner');
const spinner2 = document.querySelector('.order');
const orderForm = document.querySelector('form');
const flagLink = document.querySelector('.frud-link');

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
const fetchData = async (payload = null, id = null) => {
  if (payload) {
    const url = 'https://auto-mart-ng.herokuapp.com/api/v1/order';
    return request(url, 'POST', payload.token, payload.data);
  }
  const url = `https://auto-mart-ng.herokuapp.com/api/v1/car/${id}`;
  return request(url);
};

// loads car datail
const loadDetail = async () => {
  const carId = getId('car_id');
  flagLink.setAttribute('href', `fraud-ads.html?car_id=${carId}`);
  const { data: car, error } = await fetchData(null, carId);
  if (error) {
    return redirect('dashboard.html');
  }
  const {
 email, owner, id, ...rest 
} = car;
  updateUI(rest);
  setNavLinks();
  content.classList.remove('hide');
  spinner.classList.add('hide');
};

loadDetail();

const orderHandler = async (e) => {
  e.preventDefault();
  const price = priceInput.value;
  const carId = getId('car_id');
  const order = { amount: price, car_id: carId.toString(), status: 'pending' };
  // Check usser
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return showAlert('Create account or login to place order', alert, 'danger');
  }
  if (user.is_admin) {
    return showAlert('User is Admin, please login as ordinary user', alert, 'danger');
  }
  const { token } = user;
  let errors = {};
  let newOrder = {};
  let resStatus = null;
  spinner2.classList.remove('hide');
  if (price === '') {
    spinner2.classList.add('hide');
    return showAlert('Price cannot be empty', alert, 'danger');
  }
  if (price !== '') {
    const { error: orderErr, status, data: orderData } = await fetchData({ data: order, token });
    errors = orderErr;
    newOrder = orderData;
    resStatus = status;
  }
  if (errors && Object.values(errors).length > 0) {
    spinner2.classList.add('hide');
    priceInput.value = '';
    // return show alerts
    if (typeof errors === 'object') {
      return showAlert(Object.values(errors), alert, 'danger');
    }
    if (resStatus && resStatus === 401) {
      showAlert('Authentication error, please login or register', alert, 'danger');
      return redirect('sign-in.html');
    }
    if (resStatus && resStatus === 409) {
      return showAlert('You have already placed order for this advert', alert, 'danger');
    }
    return showAlert(errors, alert, 'danger');
  }
  if (newOrder && Object.values(newOrder).length > 0) {
    // return success alert
    spinner2.classList.add('hide');
    priceInput.classList.add('hidden');
    priceInput.value = '';
    loadDetail();
    showAlert('Order was Successful', alert, 'success');
    return redirect('dashboard.html');
  }
  spinner2.classList.add('hide');
  // reaching here means no input
  return showAlert('Input a price', alert, 'danger');
};

orderForm.onsubmit = e => orderHandler(e);

// clear localstorage and redirect to login once logout click
logoutBtn.addEventListener('click', logout);
