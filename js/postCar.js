/* global document fetch FormData */
import {
 logout, redirect, getUser, showAlert 
} from './main.js';

const fileLabel = document.querySelector('.file-name');
const form = document.querySelector('.form');
const spinner = document.querySelector('.spinner');
const logoutBtn = document.querySelector('a#logout-btn');
const content = document.querySelector('.container');
const alert = document.querySelector('.alert');
let carData = {
  manufacturer: '',
  price: '',
  model: '',
  body_type: '',
  image_url: '',
  state: '',
};

// handles form inputs
const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (e.target.files) {
    carData = { ...carData, [name]: e.target.files[0] };
    const fileName = e.target.value.split('\\').pop();
    if (fileName) {
      fileLabel.innerHTML = `<strong>${fileName}</strong>`;
    }
  } else if (name === 'number') {
    carData = { ...carData, [name]: Number(value) };
  } else {
    carData = { ...carData, [name]: value };
  }
};

// check if user is valid else redirect
const checkUserToken = () => {
  const user = getUser();
  if (!user) {
    return redirect('sign-in.html');
  }
  return content.classList.remove('hide');
};

document.addEventListener('DOMContentLoaded', checkUserToken);

const composeFormData = (data) => {
  const formData = new FormData();
  const keys = Object.keys(data);
  const values = Object.values(data);
  keys.forEach((key, index) => {
    formData.append(key, values[index]);
  });
  return formData;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  spinner.classList.remove('hide');
  const user = getUser();
  const formData = composeFormData(carData);
  if (user) {
    try {
      const config = {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await fetch('https://auto-mart-ng.herokuapp.com/api/v1/car', config);
      const { status, error } = await res.json();
      if (status !== 201) {
        if (status === 400) {
          // show error
          spinner.classList.add('hide');
          return showAlert('Please fill all input', alert, 'danger');
        }
        if (status === 401) {
          spinner.classList.add('hide');
          return redirect('sign-in.html');
        }
      }
      // request was success
      spinner.classList.add('hide');
      form.reset();
      showAlert('Car advert successfully posted', alert, 'success');
      return redirect('dashboard.html');
    } catch (error) {
      spinner.classList.add('hide');
      // Catch error is usually due to network or wrong config
      return showAlert('Network connection error', alert, 'danger');
    }
  }
  return redirect('sign-in.html');
};

// pass form submit event
form.onsubmit = e => handleSubmit(e);
document.querySelector('input[name=manufacturer]').addEventListener('change', e => handleInputChange(e));
document.querySelector('input[name=price]').addEventListener('change', e => handleInputChange(e));
document.querySelector('input[name=model]').addEventListener('change', e => handleInputChange(e));
document.querySelector('input[name=body_type]').addEventListener('change', e => handleInputChange(e));
document.querySelector('input[name=image_url]').addEventListener('change', e => handleInputChange(e));
document.querySelector('select[name=state]').addEventListener('change', e => handleInputChange(e));

// clear localstorage and redirect to login
logoutBtn.addEventListener('click', logout);
