/* global document fetch localStorage window  */
const form = document.querySelector('.form');
const spinner = document.querySelector('.spinner');
const alert = document.querySelector('.alert');

let userData = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  address: '',
};
const handleInputChange = (e) => {
  const { name, value } = e.target;
  userData = { ...userData, [name]: value };
};

const showAlert = (msg) => {
  alert.classList.remove('hide');
  alert.innerHTML = ` <i class="fas fa-info-circle"></i> ${msg}`;
  setTimeout(() => alert.classList.add('hide'), 5000);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  spinner.classList.remove('hide');
  try {
    const config = {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' },
    };
    const res = await fetch('https://auto-mart-ng.herokuapp.com/api/v1/auth/signup', config);
    const { error, data } = await res.json();
    if (data) {
      spinner.classList.add('hide');
      localStorage.setItem('user', JSON.stringify(data));
      window.location.replace('/dashboard.html');
    }
    if (error) {
      spinner.classList.add('hide');
      // error might be an object or string
      if (Object.values(error).length > 0) {
        showAlert(Object.values(error));
      } else {
        showAlert(error);
      }
    }
  } catch (error) {
    showAlert('Server Access Error');
  }
};
// pass form submit event
form.onsubmit = e => handleSubmit(e);

// Add change event to inputes
document.querySelector('input[name=first_name]').addEventListener('change', e => handleInputChange(e));
document.querySelector('input[name=last_name]').addEventListener('change', e => handleInputChange(e));
document.querySelector('input[name=email]').addEventListener('change', e => handleInputChange(e));
document.querySelector('input[name=password]').addEventListener('change', e => handleInputChange(e));
document.querySelector('textarea[name=address]').addEventListener('change', e => handleInputChange(e));
