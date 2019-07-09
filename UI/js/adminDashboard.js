/* global document localStorage fetch window */

const user = JSON.parse(localStorage.getItem('user'));
// DOM elements
const spinner = document.querySelector('.spinner');
const soldCarTb = document.querySelector('#sold');
const unsoldCarTb = document.querySelector('#unsold');
const content = document.querySelector('.content');
const dispName = document.querySelector('#user-name');
const logoutLink = document.querySelector('li.hide');
const logoutBtn = document.querySelector('a#logout-btn');
const dashLink = document.querySelector('li.logout');

// request users items (orders and post)
const getAdminItems = async (token) => {
  const config = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  };
  try {
    const res = await fetch('https://auto-mart-ng.herokuapp.com/api/v1/car', config);
    const { error, data: cars } = await res.json();
    return { error, cars };
  } catch (error) {
    return { error };
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

// formates date
const formatDate = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDatetime = new Date(date);
  const formattedDate = `${currentDatetime.getDate()} ${months[
    currentDatetime.getMonth()
  ]} ${currentDatetime.getFullYear()}`;
  return formattedDate;
};

const createCarTb = (table, data) => {
  data.map((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td class="hide-sm">${formatDate(item.created_on)}</td>
            <td>${item.model}</td>
            <td>${item.price}</td>
            <td class="hide-sm">${item.status}</td>
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

const loadData = async () => {
  // no user token, the redirect to login
  if (!user || !user.isAdmin) {
    redirect('sign-in.html');
  }
  const { error, cars } = await getAdminItems(user.token);
  // redirect back to  login if error
  if (error) {
    redirect('sign-in.html');
  }
  cars.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
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

document.addEventListener('DOMContentLoaded', loadData);

// clear localstorage and redirect to login
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('user');
  redirect('sign-in.html');
});
