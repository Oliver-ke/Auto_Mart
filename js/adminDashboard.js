/* global document */
import {
 redirect, createCarTb, request, logout, getUser 
} from './main.js';

// DOM elements
const spinner = document.querySelector('.spinner');
const soldCarTb = document.querySelector('#sold');
const unsoldCarTb = document.querySelector('#unsold');
const content = document.querySelector('.content');
const dispName = document.querySelector('#user-name');
const logoutLink = document.querySelector('li.hide');
const logoutBtn = document.querySelector('a#logout-btn');
const dashLink = document.querySelector('li.logout');

const showContent = (cars) => {
  const user = getUser();
  const soldCars = cars.filter(car => car.status === 'sold');
  const unsoldCars = cars.filter(car => car.status === 'available');
  spinner.classList.add('hide');
  createCarTb(soldCarTb, soldCars);
  createCarTb(unsoldCarTb, unsoldCars);
  // set badges
  document.querySelector('#post').innerText = cars.length;
  document.querySelector('#sold-ads').innerText = soldCars.length;
  document.querySelector('#unsold-ads').innerText = unsoldCars.length;
  dispName.textContent = `${user.first_name} ${user.last_name}`;
  content.classList.remove('hide');
  dashLink.classList.remove('hide');
  logoutLink.classList.remove('hide');
};

const loadData = async () => {
  const user = getUser();
  // no user token, the redirect to login
  if (!user || !user.is_admin) {
    return redirect('sign-in.html');
  }
  const url = 'https://auto-mart-ng.herokuapp.com/api/v1/car';
  const { error, data: cars } = await request(url, 'GET', user.token);

  // redirect back to  login if error
  if (error) {
    return redirect('sign-in.html');
  }
  cars.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
  return showContent(cars);
};

document.addEventListener('DOMContentLoaded', loadData);

// clear localstorage and redirect to login
logoutBtn.addEventListener('click', logout);
