/* global document localStorage fetch window */
// target DOM elements
const logoutBtn = document.querySelector('a#logout-btn');
const priceInput = document.querySelector('input[name=biding-price]');
const content = document.querySelector('section.hide');
const alert = document.querySelector('.alert');
const spinner = document.querySelector('.container .spinner');
const spinner2 = document.querySelector('.order');
const orderForm = document.querySelector('form');

// Redirect function
const redirect = (location) => {
	const regex = new RegExp('github.io', 'gi');
	const reponame = window.location.href.split('/')[3];
	if (window.location.host.match(regex)) {
		return window.location.replace(`/${reponame}/${location}`);
	}
	return window.location.replace(`/${location}`);
};

// formate display date
const formatDate = (date) => {
	const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
	const currentDatetime = new Date(date);
	const formattedDate = `${currentDatetime.getDate()} ${months[
		currentDatetime.getMonth()
	]} ${currentDatetime.getFullYear()}`;
	return formattedDate;
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
	setTimeout(() => alert.classList.add('hide'), 6000);
};

// update ui
const updateUI = (data) => {
	const keys = Object.keys(data);
	const values = Object.values(data);
	keys.map((key, index) => {
		if (key === 'img_url') {
			// set for img
			document.querySelector(`img#${key}`).src = values[index];
		} else if (key === 'created_on') {
			// formate date
			const date = formatDate(values[index]);
			document.querySelector(`span#${key}`).innerText = ` ${date}`;
		} else if (key === 'price') {
			document.querySelector(`span#${key}`).innerText = ` #${values[index]}`;
		} else {
			document.querySelector(`span#${key}`).innerText = ` ${values[index]}`;
		}
	});
};

// Fetch car data
const fetchData = async (id) => {
	if (id) {
		try {
			const url = `https://auto-mart-ng.herokuapp.com/api/v1/car/${id}`;
			const res = await fetch(url);
			const { data: car } = await res.json();
			return { car };
		} catch (error) {
			return { error };
		}
	}
	return { error: 'Invalid id' };
};

// Make order request
const makeOrder = async (newData, token) => {
	const config = {
		body: JSON.stringify(newData),
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
	};
	try {
		const url = 'https://cors-anywhere.herokuapp.com/http://auto-mart-ng.herokuapp.com/api/v1/order';
		const res = await fetch(url, config);
		const data = await res.json();
		return await data;
	} catch (error) {
		return { error };
	}
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

// Get carId from query params in url
const getCarId = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const carId = Number(urlParams.get('car_id'));
	return carId;
};

// loads car datail
const loadDetail = async () => {
	const carId = getCarId();
	const { car, error } = await fetchData(carId);
	if (error) {
		return redirect('dashboard.html');
	}
	const { email, owner, id, ...rest } = car;
	updateUI(rest);
	setNavLinks();
	content.classList.remove('hide');
	spinner.classList.add('hide');
};

loadDetail();

const orderHandler = async (e) => {
	e.preventDefault();
	const price = priceInput.value;
	const carId = getCarId();
	const order = { amount: price, car_id: Number(carId), status: 'pending' };
	// Check usser
	const user = JSON.parse(localStorage.getItem('user'));
	if (!user) {
		return showAlert('Create account or login to place order', alert, 'danger');
	}
	const { token } = user;
	let errors = {};
	let newOrder = {};
	spinner2.classList.remove('hide');
	if (price === '') {
		spinner2.classList.add('hide');
		return showAlert('Price cannot be empty', alert, 'danger');
	}
	if (price !== '') {
		const { error: orderErr, data: orderData } = await makeOrder(order, token);
		errors = { orderErr };
		newOrder = { orderData };
	}
	if (Object.values(errors).length > 0) {
		spinner2.classList.add('hide');
		priceInput.value = '';
		// return show alerts
		if (typeof errors === 'object') {
			return showAlert(Object.values(errors), alert, 'danger');
		}
		return showAlert(errors, alert, 'danger');
	}
	if (Object.values(newOrder).length > 0) {
		// return success alert
		spinner2.classList.add('hide');
		priceInput.classList.add('hidden');
		priceInput.value = '';
		loadDetail();
		return showAlert('Order was Successful', alert, 'success');
	}
	spinner2.classList.add('hide');
	// reaching here means no input
	return showAlert('Input a price', alert, 'danger');
};

orderForm.onsubmit = (e) => orderHandler(e);

// clear localstorage and redirect to login once logout click
logoutBtn.addEventListener('click', (e) => {
	e.preventDefault();
	localStorage.removeItem('user');
	redirect('sign-in.html');
});
