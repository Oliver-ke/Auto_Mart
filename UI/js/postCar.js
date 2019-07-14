/* global document localStorage fetch window FormData */
const fileLabel = document.querySelector('.file-name');
const form = document.querySelector('.form');
const spinner = document.querySelector('.spinner');
const logoutBtn = document.querySelector('a#logout-btn');
const alertError = document.querySelector('.alert-danger');
const content = document.querySelector('.container');
const alertSuccess = document.querySelector('.alert-success');
let carData = {
  manufacturer: '',
  price: '',
  model: '',
  body_type: '',
  image_url: '',
  state: '',
};

// Get the user
const user = JSON.parse(localStorage.getItem('user'));

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

const redirect = (location) => {
  const regex = new RegExp('github.io', 'gi');
  const reponame = window.location.href.split('/')[3];
  if (window.location.host.match(regex)) {
    return window.location.replace(`/${reponame}/${location}`);
  }
  return window.location.replace(`/${location}`);
};

// check if user is valid else redirect
const checkUserToken = () => {
  if (!user) {
    return redirect('sign-in.html');
  }
  return content.classList.remove('hide');
};

checkUserToken();

const showAlert = (msg, alert) => {
  alert.classList.remove('hide');
  alert.innerHTML = ` <i class="fas fa-info-circle"></i> ${msg}`;
  setTimeout(() => alert.classList.add('hide'), 6000);
};

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
      const { status, data, error } = await res.json();
      if (status !== 201) {
        if (status === 400) {
          // show error
          spinner.classList.add('hide');
          return showAlert(error, alertError);
        }
        if (status === 401) {
          spinner.classList.add('hide');
          return redirect('sign-in.html');
        }
      }
      // request was success
      spinner.classList.add('hide');
      form.reset();
      showAlert('Car advert successfully posted', alertSuccess);
      return redirect('dashboard.html');
    } catch (error) {
      spinner.classList.add('hide');
      // Catch error is usually due to network or wrong config
      return showAlert('Network connection error', alertError);
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
document.querySelector('input[name=carImg]').addEventListener('change', e => handleInputChange(e));
document.querySelector('select[name=state]').addEventListener('change', e => handleInputChange(e));

// clear localstorage and redirect to login
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('user');
  return redirect('sign-in.html');
});
