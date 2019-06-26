"use strict";

/* global document localStorage fetch window */
const user = JSON.parse(localStorage.getItem('user'));
const spinner = document.querySelector('.spinner');
const postTable = document.querySelector('#post');
const orderTable = document.querySelector('#order');
const content = document.querySelector('.content');
const dispName = document.querySelector('#user-name');

const getUserItems = async token => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const postRes = await fetch('https://auto-mart-ng.herokuapp.com/api/v1/car/users/posts', config);
    const orderRes = await fetch('https://auto-mart-ng.herokuapp.com/api/v1/order', config);
    const {
      error: postErr,
      data: posts
    } = await postRes.json();
    const {
      error: orderErr,
      data: orders
    } = await orderRes.json();

    if (postErr || orderErr) {
      return {
        error: { ...postErr,
          ...orderErr
        }
      };
    }

    return {
      posts,
      orders
    };
  } catch (error) {
    return {
      error
    };
  }
};

const createTable = (table, data) => {
  data.map(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${item.created_on.split('T')[0]}</td>
            <td>${item.model}</td>
            <td>${item.price}</td>
            <td>${item.status}</td>
            <td> <button class="btn btn-danger">
              <a href="update-car-price.html?car_id=${item.id}">
                View
              </a>
            </button>
            </td>
        `;
    table.appendChild(row);
  });
};

const loadData = async () => {
  const {
    error,
    posts,
    orders
  } = await getUserItems(user.token);

  if (error) {
    console.log(error);
    return window.location.replace('/sign-in.html');
  }

  spinner.classList.add('hide');
  createTable(postTable, posts); // createTable(orderTable,orders);

  dispName.textContent = `${user.first_name} ${user.last_name}`;
  content.classList.remove('hide');
  console.log(posts, orders);
};

loadData(); // createTable(postTable, data);
//# sourceMappingURL=dashboard.js.map