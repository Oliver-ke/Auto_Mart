/* global document localStorage fetch window */

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

const setNavLinks = () => {
  if (JSON.parse(localStorage.getItem('user'))) {
    document.querySelector('li#dash-link').classList.remove('hide');
    document.querySelector('li#sign-in').classList.remove('hide');
    document.querySelector('#login').classList.add('hide');
  }
};

const fetchData = async (query = null) => {
  let url = 'https://auto-mart-ng.herokuapp.com/api/v1/car?status=available';
  if (query) {
    // make request with query
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
    try {
      const res = await fetch(url);
      const { data: cars, error } = await res.json();
      return { cars, error };
    } catch (error) {
      return { error };
    }
  }
  try {
    const res = await fetch(url);
    const { data: cars, error } = await res.json();
    return { cars, error };
  } catch (error) {
    return { error };
  }
};

const initializer = async () => {
  setNavLinks();
  spinner.classList.remove('hide');
  const { cars, error } = await fetchData();
  if (!cars) {
    window.location.reload();
  }
  cars.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
  spinner.classList.add('hide');
  if (!error) {
    return updateUI(cars.splice(0, 6));
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
    const { cars } = await fetchData();
    const search = model.value.toLowerCase();
    const matches = cars.filter((car) => {
      const regex = new RegExp(`^${search}`, 'gi');
      return car.model.match(regex);
    });
    result = [...matches, ...result];
  }
  if (max.value && max.min) {
    const query = { max: max.value, min: min.value };
    const { cars } = await fetchData(query);
    result = cars ? [...cars, ...result] : [...result];
  }
  if (manufacturer.value) {
    const query = { manufacturer: manufacturer.value };
    const { cars } = await fetchData(query);
    result = cars ? [...cars, ...result] : [...result];
  }
  if (bodyType.value) {
    const query = { body_type: bodyType.value };
    const { cars } = await fetchData(query);
    result = cars ? [...cars, ...result] : [...result];
  }
  if (state.value !== 'None') {
    const query = { state: state.value };
    const { cars } = await fetchData(query);
    result = cars ? [...cars, ...result] : [...result];
  }
  spinner.classList.add('hide');
  carContainer.classList.remove('hide');
  headTxt.textContent = result.length > 0 ? `Search Result ${result.length}` : 'No Search Result found';
  return updateUI(result);
};

form.onsubmit = e => handleSubmit(e);
