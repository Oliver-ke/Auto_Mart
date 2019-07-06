/* global document localStorage fetch window */
const logoutBtn = document.querySelector('a#logout-btn');
const alert = document.querySelector('.alert');
const spinner = document.querySelector('.container .spinner');
const flagForm = document.querySelector('form');

// Redirect function
const redirect = (location) => {
  const regex = new RegExp('github.io', 'gi');
  const reponame = window.location.href.split('/')[3];
  if (window.location.host.match(regex)) {
    return window.location.replace(`/${reponame}/${location}`);
  }
  return window.location.replace(`/${location}`);
};

// Make post flag
const postFlag = async (newData, token) => {
  const config = {
    body: JSON.stringify(newData),
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  };
  try {
    const url = 'https://auto-mart-ng.herokuapp.com/api/v1/flag';
    const res = await fetch(url, config);
    const data = await res.json();
    return await data;
  } catch (error) {
    return { error };
  }
};

// Get carId from query params in url
const getCarId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const carId = Number(urlParams.get('car_id'));
  return carId;
};
// Set nav link visibility
const setNavLinks = () => {
  if (JSON.parse(localStorage.getItem('user'))) {
    document.querySelector('li#dash-link').classList.remove('hide');
    document.querySelector('li#sign-in').classList.remove('hide');
    document.querySelector('#login').classList.add('hide');
    document.querySelector('#register').classList.add('hide');
  }
};

// show alert
const showAlert = (msg, alert, type, time = 5000) => {
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
  const carId = getCarId();
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
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('user');
  redirect('sign-in.html');
});
