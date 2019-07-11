/* global document localStorage fetch window */
// target DOM elements
const logoutBtn = document.querySelector('a#logout-btn');
const alert = document.querySelector('.alert');
const spinner = document.querySelector('.container .spinner');
const form = document.querySelector('form');

// Redirect function
const redirect = (location) => {
  const regex = new RegExp('github.io', 'gi');
  const reponame = window.location.href.split('/')[3];
  if (window.location.host.match(regex)) {
    return window.location.replace(`/${reponame}/${location}`);
  }
  return window.location.replace(`/${location}`);
};

// Make password reset
const sendRequest = async (reqData, url) => {
  const config = {
    body: JSON.stringify(reqData),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };
  try {
    const res = await fetch(url, config);
    if (res.status === 204) {
      return { status: 204 };
    }
    return await res.json();
  } catch (error) {
    return { error };
  }
};

// show alert
const showAlert = (msg, alert, type) => {
  alert.classList.remove('hide');
  if (alert.classList.contains('alert-danger')) {
    alert.classList.remove('alert-danger');
  }
  if (alert.classList.contains('alert-success')) {
    alert.classList.remove('alert-success');
  }
  alert.classList.add(`alert-${type}`);
  alert.innerHTML = ` <i class="fas fa-info-circle"></i> ${msg}`;
  setTimeout(() => alert.classList.add('hide'), 5000);
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
  const { status, error } = await sendRequest(reqData, url);
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
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('user');
  redirect('sign-in.html');
});
