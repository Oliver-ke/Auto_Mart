const fileLabel = document.querySelector('.file-name');
const inputFile = document.querySelector('input[type="file"]');
inputFile.addEventListener('change', (e) => {
  console.log(e.target.value);
  const fileName = e.target.value.split('\\').pop();
  if (fileName) {
    fileLabel.innerHTML = `<strong>${fileName}</strong>`;
  }
});
