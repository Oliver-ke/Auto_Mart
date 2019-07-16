/* global document */
import { setNavLinks, request } from './main.js';

const form = document.querySelector('form');
const carContainer = document.querySelector('#car-container');
// loading spinner
const spinner = document.querySelector('.spinner');

// head-text
const headTxt = document.querySelector('.head-text');

// search inputs
const model = document.querySelector('input[name=model]');
const max = document.querySelector('input[name=max]');
const min = document.querySelector('input[name=min]');
const manufacturer = document.querySelector('input[name=manufacturer]');
const bodyType = document.querySelector('input[name=body-type]');
const state = document.querySelector('select[name=state]');

const updateUI = (cars) => {
  carContainer.innerHTML = '';
  cars.map((car) => {
    const newCar = `
        <img src=${car.image_url} alt="car-img" class="car-img">
        <p class="name mx-1">${car.model}</p>
        <div class="tags p-1">
          <p class="state">State: <span>${car.state}</span></p>
          <p class="price">Price: <span>#${car.price}</span></p>
        </div>
        <a href="purchase-order.html?car_id=${car.id}" class="btn ">View Car</a>
    `;
    const carDiv = document.createElement('div');
    carDiv.className = 'car';
    carDiv.innerHTML = newCar;
    carContainer.appendChild(carDiv);
  });
};

const queryReq = async (params, query) => {
  // make request with query
  let url = params;
  if (query.min || query.max) {
    url += `&min_price=${query.min}&max_price${query.max}`;
  } else if (query.body_type) {
    const value = Object.values(query);
    const key = Object.keys(query);
    url = `https://auto-mart-ng.herokuapp.com/api/v1/car?${key}=${value}`;
  } else {
    const value = Object.values(query);
    const key = Object.keys(query);
    url += `&${key}=${value}`;
  }
  const res = await request(url);
  return res;
};

const fetchData = async (query = null) => {
  const url = 'https://auto-mart-ng.herokuapp.com/api/v1/car?status=available';
  if (query) {
    return queryReq(url, query);
  }
  const res = await request(url);
  return res;
};

const initializer = async () => {
  setNavLinks();
  spinner.classList.remove('hide');
  const { data: cars, error } = await fetchData();
  cars.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
  spinner.classList.add('hide');
  if (!error) {
    return updateUI(cars);
  }
  return updateUI([]);
};

document.addEventListener('DOMContentLoaded', initializer);

const handleSubmit = async (e) => {
  e.preventDefault();
  headTxt.textContent = 'Loading...';
  spinner.classList.remove('hide');
  carContainer.classList.add('hide');
  let result = [];
  if (model.value) {
    const { data: cars } = await fetchData();
    const search = model.value.toLowerCase();
    const matches = cars.filter((car) => {
      const regex = new RegExp(`^${search}`, 'gi');
      return car.model.match(regex);
    });
    result = [...matches, ...result];
  }

  if (max.value && max.min) {
    const query = { max: max.value, min: min.value };
    const { data: cars } = await fetchData(query);
    result = cars ? [...cars, ...result] : [...result];
    result = result.filter(car => car.price >= min.value && car.price <= max.value);
  }
  if (manufacturer.value) {
    const query = { manufacturer: manufacturer.value };
    const { data: cars } = await fetchData(query);
    result = cars ? [...cars, ...result] : [...result];
    result = result.filter(car => car.manufacturer === manufacturer.value);
  }
  if (bodyType.value) {
    const query = { body_type: bodyType.value };
    const { data: cars } = await fetchData(query);
    result = cars ? [...cars, ...result] : [...result];
    result = result.filter(car => car.body_type === bodyType.value);
  }
  if (state.value !== 'None') {
    const query = { state: state.value };
    const { data: cars } = await fetchData(query);
    result = cars ? [...cars, ...result] : [...result];
    result = result.filter(car => car.state === state.value);
  }

  spinner.classList.add('hide');
  carContainer.classList.remove('hide');
  headTxt.textContent = result.length > 0 ? `Search Result ${result.length}` : 'No Search Result found';
  return updateUI(result);
};

form.onsubmit = e => handleSubmit(e);
