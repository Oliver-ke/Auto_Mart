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
// handles form inputs
const handleInputChange = (e) => {
  const { name, value } = e.target;
  userData = { ...userData, [name]: value };
};

// shows alert
const showAlert = (msg) => {
  alert.classList.remove('hide');
  alert.innerHTML = ` <i class="fas fa-info-circle"></i> ${msg}`;
  setTimeout(() => alert.classList.add('hide'), 5000);
};

// Handle form submit
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
      if (data.is_admin) {
        const regex = new RegExp('github.io', 'gi');
        const reponame = window.location.href.split('/')[3];
        if (window.location.host.match(regex)) {
          window.location.replace(`/${reponame}/admin-dashboard.html`);
        } else {
          window.location.replace('/admin-dashboard.html');
        }
      } else {
        const regex = new RegExp('github.io', 'gi');
        const repoName = window.location.href.split('/')[3];
        if (window.location.host.match(regex)) {
          window.location.replace(`/${repoName}/dashboard.html`);
        } else {
          window.location.replace('/dashboard.html');
        }
      }
    }
    if (error) {
      spinner.classList.add('hide');
      // error might be an object or string
      if (typeof error === 'object') {
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
