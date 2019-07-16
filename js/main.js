/* global document localStorage fetch window */

// Redirect function
export const redirect = (location) => {
  const regex = new RegExp('github.io', 'gi');
  const reponame = window.location.href.split('/')[3];
  if (window.location.host.match(regex)) {
    return window.location.replace(`/${reponame}/${location}`);
  }
  return window.location.replace(`/${location}`);
};

// formate display date
export const formatDate = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDatetime = new Date(date);
  const formattedDate = `${currentDatetime.getDate()} ${months[
    currentDatetime.getMonth()
  ]} ${currentDatetime.getFullYear()}`;
  return formattedDate;
};

// show alert
export const showAlert = (msg, alert, type, time = 5000) => {
  alert.classList.remove('hide');
  if (alert.classList.contains('alert-danger')) {
    alert.classList.remove('alert-danger');
  }
  if (alert.classList.contains('alert-success')) {
    alert.classList.remove('alert-success');
  }
  alert.classList.add(`alert-${type}`);
  alert.innerHTML = ` <i class="fas fa-info-circle"></i> ${msg}`;
  setTimeout(() => alert.classList.add('hide'), time);
};

// Set nav link visibility
export const setNavLinks = () => {
  if (JSON.parse(localStorage.getItem('user'))) {
    document.querySelector('li#dash-link').classList.remove('hide');
    document.querySelector('li#sign-in').classList.remove('hide');
    document.querySelector('#login').classList.add('hide');
    document.querySelector('#register').classList.add('hide');
  }
};

// Get params from url
export const getId = (field) => {
  const urlParams = new URLSearchParams(window.location.search);
  const carId = Number(urlParams.get(field));
  return carId;
};

// Get user
export const getUser = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user;
};

export const logout = (e) => {
  e.preventDefault();
  localStorage.removeItem('user');
  redirect('sign-in.html');
};

// make request
export const request = async (url, method = 'GET', token = '', payload = {}) => {
  let config = {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  };
  if (payload.image_url) {
    config = {
      method,
      headers: { Authorization: `Bearer ${token}` },
    };
  } else if (Object.keys(payload).length > 0) {
    config.body = JSON.stringify(payload);
  }
  try {
    const res = await fetch(url, config);
    if (res.status === 204) {
      return { status: 204 };
    }
    const data = await res.json();
    return await data;
  } catch (error) {
    return { error };
  }
};

export const createCarTb = (table, data) => {
  data.map((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td class="hide-sm">${formatDate(item.created_on)}</td>
            <td>${item.model}</td>
            <td>${item.price}</td>
            <td class="hide-sm">${item.status}</td>
            <td class="hide-sm">${item.state}</td>
            <td> <button class="btn btn-danger">
              <a href="car.html?car_id=${item.id}">
                View/Delete
              </a>
            </button>
						</td>
        `;
    table.appendChild(row);
  });
};

// create Order table
export const createOrderTable = (table, data) => {
  data.map((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${formatDate(item.created_on)}</td>
            <td class="hide-sm">${item.car_price}</td>
            <td class="hide-sm">${item.amount}</td>
            <td>${item.status}</td>
            <td> <button class="btn btn-danger">
              <a href="update-order.html?order_id=${item.id}">
                View
              </a>
            </button>
						</td>
        `;
    table.appendChild(row);
  });
};
