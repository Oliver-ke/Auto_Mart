let fileLabel = document.querySelector('.file-name');
let inputFile = document.querySelector('input[type="file"]');
inputFile.addEventListener('change', (e) => {
	console.log(e.target.value);
	let fileName = e.target.value.split('\\').pop();
	if (fileName) {
		fileLabel.innerHTML = `<strong>${fileName}</strong>`;
	}
});
