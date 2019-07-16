/* global document localStorage fetch window */
import {
 redirect, formatDate, logout, showAlert, setNavLinks, getId, request 
} from './main.js';
// target DOM elements
const logoutBtn = document.querySelector('a#logout-btn');
const content = document.querySelector('section.hide');
const alert = document.querySelector('.alert');
const spinner = document.querySelector('.container .spinner');
const spinner2 = document.querySelector('.order');
const orderForm = document.querySelector('form');
const editBtn = document.querySelector('#change-price');
const priceInput = document.querySelector('input[name=updatePrice]');

// update ui
const updateUI = (data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  keys.map((key, index) => {
    if (key === 'imgUrl') {
      // set for img
      document.querySelector(`img#${key}`).src = values[index];
    } else if (key === 'createdOn') {
      // formate date
      const date = formatDate(values[index]);
      document.querySelector(`span#${key}`).innerText = ` ${date}`;
    } else if (key === 'price' || key === 'amount') {
      document.querySelector(`span#${key}`).innerText = ` #${values[index]}`;
    } else if (document.querySelector(`span#${key}`)) {
      document.querySelector(`span#${key}`).innerText = ` ${values[index]}`;
    }
  });
};

// Make order update request
const updateOrder = async (update, token) => {
  const { price } = update;
  const url = `https://auto-mart-ng.herokuapp.com/api/v1/order/${update.orderId}/price`;
  return request(url, 'PATCH', token, { price });
};

// loads car datail
const loadDetail = async () => {
  const orderId = getId('order_id');
  // get order with the given id
  const orderUrl = `https://auto-mart-ng.herokuapp.com/api/v1/order/${orderId}`;
  const { data: order, error } = await request(orderUrl);
  if (error) {
    return redirect('dashboard.html');
  }

  // get car details that was ordered
  const {
 car_id: carId, amount, created_on: createdOn, status 
} = order;
  const carUrl = `https://auto-mart-ng.herokuapp.com/api/v1/car/${carId}`;
  const { data: car, error: carErr } = await request(carUrl);
  if (carErr) {
    return redirect('dashboard.html');
  }
  const {
 model, image_url: imgUrl, price, email, state, manufacturer 
} = car;
  const info = {
    model,
    imgUrl,
    price,
    email,
    amount,
    createdOn,
    status,
    state,
    manufacturer,
  };

  // const info = { ...car, ...order };
  updateUI(info);
  setNavLinks();
  content.classList.remove('hide');
  spinner.classList.add('hide');
};

document.addEventListener('DOMContentLoaded', loadDetail);

const orderHandler = async (e) => {
  e.preventDefault();
  const price = priceInput.value;
  const orderId = getId('order_id');
  const order = { price: Number(price), orderId, status: 'pending' };
  // Check usser
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return showAlert('login to dashbord to update order', alert, 'danger');
  }
  const { token } = user;

  spinner2.classList.remove('hide');
  if (price === '') {
    spinner2.classList.add('hide');
    return showAlert('Price cannot be empty', alert, 'danger');
  }

  const { error: orderErr, status, data: orderData } = await updateOrder(order, token);

  if (orderErr && Object.values(orderErr).length > 0) {
    spinner2.classList.add('hide');
    priceInput.value = '';
    // return show alerts
    if (typeof orderErr === 'object') {
      return showAlert(Object.values(orderErr), alert, 'danger');
    }
    if (status && status === 401) {
      showAlert('Authentication error, please login', alert, 'danger');
      return redirect('sign-in.html');
    }
    return showAlert(orderErr, alert, 'danger');
  }
  if (orderData && Object.values(orderData).length > 0) {
    // return success alert
    spinner2.classList.add('hide');
    priceInput.classList.add('hidden');
    priceInput.value = '';
    loadDetail();
    return showAlert('Order updated successfully', alert, 'success');
  }
  spinner2.classList.add('hide');
  // reaching here means no input
  return showAlert('Input a price', alert, 'danger');
};

orderForm.onsubmit = e => orderHandler(e);

// clear localstorage and redirect to login once logout click
logoutBtn.addEventListener('click', logout);

// toggle edit input visbility
editBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (priceInput.classList.contains('hidden')) {
    const privAmount = document.querySelector('span#amount');
    priceInput.value = privAmount.innerText.slice(2);
    priceInput.classList.remove('hidden');
  } else {
    priceInput.classList.add('hidden');
    priceInput.value = '';
  }
});
