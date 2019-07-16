/* global document */
import {
 request, createCarTb, redirect, createOrderTable, getUser, logout 
} from './main.js';

const spinner = document.querySelector('.spinner');
const postTable = document.querySelector('#post');
const orderTable = document.querySelector('#order');
const content = document.querySelector('.content');
const dispName = document.querySelector('#user-name');
const logoutLink = document.querySelector('li.hide');
const logoutBtn = document.querySelector('a#logout-btn');
const dashLink = document.querySelector('li.logout');

// request users items (orders and post)
const getUserItems = async (token) => {
  const postUrl = 'https://auto-mart-ng.herokuapp.com/api/v1/car/users/posts';
  const { error: postErr, data: posts } = await request(postUrl, 'GET', token);
  const orderUrl = 'https://auto-mart-ng.herokuapp.com/api/v1/order';
  const { error: orderErr, data: orders } = await request(orderUrl, 'GET', token);
  const error = { ...postErr, ...orderErr };
  return { error, posts, orders };
};

const showItems = (posts, orders, user) => {
  posts.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
  orders.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
  spinner.classList.add('hide');
  createCarTb(postTable, posts);
  createOrderTable(orderTable, orders);
  dispName.textContent = `${user.first_name} ${user.last_name}`;
  content.classList.remove('hide');
  dashLink.classList.remove('hide');
  logoutLink.classList.remove('hide');
};

const loadData = async () => {
  // no user token, the redirect to login
  const user = getUser();
  if (!user) {
    return redirect('sign-in.html');
  }
  if (user.is_admin) {
    return redirect('admin-dashboard.html');
  }
  const { error, posts, orders } = await getUserItems(user.token);
  // redirect back to  login if error
  if (Object.keys(error).length > 0) {
    return redirect('sign-in.html');
  }
  return showItems(posts, orders, user);
};

// clear localstorage and redirect to login
logoutBtn.addEventListener('click', logout);

loadData();
