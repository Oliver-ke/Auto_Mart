"use strict";

const editBtn = document.querySelector('.biding-price button.btn');
const input = document.querySelector('.biding-price .form-group input');
editBtn.addEventListener('click', e => {
  e.preventDefault();
  input.removeAttribute('readonly');
  input.classList.add('focus');
});