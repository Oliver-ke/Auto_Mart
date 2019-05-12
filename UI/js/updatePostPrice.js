const editBtn = document.querySelector('#change-price');
const input = document.querySelector('input[name="updatePrice"]');

let isOpen = false;
editBtn.addEventListener('click', (e) => {
	e.preventDefault();
	if (isOpen) {
		input.classList.add('hidden');
		input.value = '';
		isOpen = false;
	} else {
		input.classList.remove('hidden');
		console.log('isClosed');
		isOpen = true;
	}
});
