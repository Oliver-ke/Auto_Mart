/* global document localStorage fetch window */
const user = JSON.parse(localStorage.getItem('user'));
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
	const config = {
		method: 'GET',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
	};
	try {
		const postRes = await fetch('https://auto-mart-ng.herokuapp.com/api/v1/car/users/posts', config);
		const orderRes = await fetch('https://auto-mart-ng.herokuapp.com/api/v1/order', config);
		const { error: postErr, data: posts } = await postRes.json();
		const { error: orderErr, data: orders } = await orderRes.json();
		if (postErr || orderErr) {
			return { error: { ...postErr, ...orderErr } };
		}
		return { posts, orders };
	} catch (error) {
		return { error };
	}
};

// redirect to login
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
	const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
	const currentDatetime = new Date(date);
	const formattedDate = `${currentDatetime.getDate()} ${months[
		currentDatetime.getMonth()
	]} ${currentDatetime.getFullYear()}`;
	return formattedDate;
};

// create Order table
const createOrderTable = (table, data) => {
	data.map((item) => {
		const row = document.createElement('tr');
		row.innerHTML = `
            <td>${formatDate(item.created_on)}</td>
            <td class="hide-sm">${item.car_price}</td>
            <td class="hide-sm">${item.amount}</td>
            <td>${item.status}</td>
            <td> <button class="btn btn-danger">
              <a href="update-order.html?order_id=${item.id}">
                View
              </a>
            </button>
						</td>
        `;
		table.appendChild(row);
	});
};

const createPostTable = (table, data) => {
	data.map((item) => {
		const row = document.createElement('tr');
		row.innerHTML = `
            <td class="hide-sm">${formatDate(item.created_on)}</td>
            <td>${item.model}</td>
            <td>${item.price}</td>
            <td class="hide-sm">${item.status}</td>
            <td> <button class="btn btn-danger">
              <a href="car.html?car_id=${item.id}">
                View
              </a>
            </button>
						</td>
        `;
		table.appendChild(row);
	});
};
const loadData = async () => {
	// no user token, the redirect to login
	if (!user) {
		return redirect('sign-in.html');
	}
	if (user.is_admin) {
		return redirect('admin-dashboard.html');
	}
	const { error, posts, orders } = await getUserItems(user.token);
	// redirect back to  login if error
	if (error) {
		return redirect('sign-in.html');
	}
	posts.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
	orders.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
	spinner.classList.add('hide');
	createPostTable(postTable, posts);
	createOrderTable(orderTable, orders);
	dispName.textContent = `${user.first_name} ${user.last_name}`;
	content.classList.remove('hide');
	dashLink.classList.remove('hide');
	logoutLink.classList.remove('hide');
};

// clear localstorage and redirect to login
logoutBtn.addEventListener('click', (e) => {
	e.preventDefault();
	localStorage.removeItem('user');
	return redirect('sign-in.html');
});

loadData();
